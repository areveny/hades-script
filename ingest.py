import typing
from ingestion_db import IngestionDB, SqliteIngestionDB


class Ingestion():

    def __init__(self, file, ingestion_db):
        self.names_stack = list()
        self.ingestion_db = ingestion_db

        f = open(file, 'r')
        self.code_lines = iter(f)
        root_context = dict()
        self.process(next(self.code_lines), root_context)
        print(root_context)

    def populate(self, code: typing.IO):
        try:
            while True:
                self.process(next(self.code_lines))
        except StopIteration:
            return

    delimiting_symbols = {'--', '{', '}', '=', '"', ','}

    def next_symbol(line):
        locs: typing.Dict[int, str] = dict()
        for symbol in Ingestion.delimiting_symbols:
            locs[line.find(symbol)] = symbol
        
        found_symbols = [i for i in locs.keys() if i != -1]
        if len(found_symbols) == 0:
            return None, None

        leading_symbol_loc = min(found_symbols)
        leading_symbol = locs[leading_symbol_loc]

        return leading_symbol, leading_symbol_loc

    def process(self, cur_line: str, context: dict) -> typing.Tuple[str, dict]:
        print(cur_line, context)
        print(self.names_stack)
        if 'Cooldowns' in self.names_stack:
            breakpoint()
            # raise StopIteration
            pass

        while True:
            cur_line = cur_line.strip()
            leading_symbol, leading_symbol_loc = Ingestion.next_symbol(cur_line)
            if leading_symbol is None:
                cur_line = next(self.code_lines)
                continue

            if leading_symbol == '--':
                cur_line = next(self.code_lines)
                continue
            elif leading_symbol == '{':
                nested_context = dict()
                cur_line = cur_line[leading_symbol_loc + 1:]
                cur_line, result_context = self.process(cur_line, nested_context) # Create new context
                while result_context:
                    cur_line, result_context = self.process(cur_line, nested_context) # Create new context
                # The cur_line is already advanced in the base case below
                return cur_line, nested_context
                # Test if nested object is a viable Cue, then process it
            elif leading_symbol == '}':
                if leading_symbol_loc == 0:
                    return cur_line[leading_symbol_loc + 1:], None # Close the context
                else:
                    return cur_line[leading_symbol_loc:], cur_line[:leading_symbol_loc].strip() # Return literal val

            elif leading_symbol == '=':
                name = cur_line[:leading_symbol_loc].strip()
                cur_line = cur_line[leading_symbol_loc + 1:]
                self.names_stack.append(name)

                cur_line, context[name] = self.process(cur_line, context) # Get the assign target and add to context
                self.names_stack.pop()
                return cur_line, context # Let an assignment return the value of the assigned

            elif leading_symbol == '"':
                closing_quote_loc = cur_line[leading_symbol_loc + 1:].find('"')
                line = cur_line[closing_quote_loc + 1:] # Advance line past the closing quote
                value = cur_line[leading_symbol_loc + 1:closing_quote_loc + 2].strip() # Slice value between quotes
                closing_comma_loc = line.find(',') # Find closing comma of this assignment
                line = line[closing_comma_loc + 1:].lstrip() # Advance line past closing comma
                return line, value
            elif leading_symbol == ',':
                # If we detect no more content, .e.g. just ',', advance line. There must be more
                remainder = cur_line[leading_symbol_loc + 1:]
                # leading_symbol, leading_symbol_loc = Ingestion.next_symbol(remainder)

                if leading_symbol_loc == 0:
                    cur_line = next(self.code_lines)
                    continue

                # If there is content, consume up to it
                # Case where remainder is '}' or more data after comma
                return cur_line[leading_symbol_loc + 1:], cur_line[:leading_symbol_loc].strip() # Return literal val

    def find_assignment_or_table(self, code: typing.IO, cur_line: str):
        """Processes unassigned tables and assignments of tables to a name"""
        print(self.names_stack, cur_line[:-1])
        # if "HadesPostFlashback01" in self.names_stack:
        if "TemporaryImprovedWeaponTrait_Patroclus" in cur_line:
            # breakpoint()
            # raise StopIteration
            pass
        while code:
            comment_loc = cur_line.find('--')
            bracket_loc = cur_line.find('{')
            close_bracket_loc = cur_line.find('}')
            assign_loc = cur_line.find('=')

            if comment_loc != -1 and comment_loc < bracket_loc and comment_loc < assign_loc:
                cur_line = next(code)
                continue
            if bracket_loc != -1 and \
                    not(assign_loc != -1 and assign_loc < bracket_loc): # Found unassigned table 
                cur_line = '{'.join(cur_line.split('{')[1:]) # Get everything after the open bracket
                self.find_assignment_or_table(code, cur_line)
                cur_line = '}'.join(cur_line.split('}')[1:]) # Get everything after the close bracket

            if " Cue " in cur_line:
                parsed_object = self.process_voice_line(code, cur_line)
                print(parsed_object)

                if self.ingestion_db.can_process_object(parsed_object):
                    try:
                        self.data_objects.append({'line_name': parsed_object['Cue'], 
                            'conversation_name': self.names_stack[-1], 
                            'speaker': get_speaker_from_name(parsed_object['Cue']),
                            'text': parsed_object['Text']})
                    except KeyError:
                        pass
                return

            if assign_loc != -1 and \
                    not(close_bracket_loc != -1 and close_bracket_loc < assign_loc): # Found assignment
                split_line = cur_line.split(' =')
                candidate_name = split_line[0].strip()
                cur_line = ' ='.join(split_line[1:])

                # Try and find out if we have a table or a simple assignment
                while code:
                    if '{' in cur_line: # Table
                        cur_line = cur_line[cur_line.find('{') + 1:] # Get everything after the open bracket
                        self.names_stack.append(candidate_name)
                        self.find_assignment_or_table(code, cur_line)
                        self.names_stack.pop()
                        cur_line = cur_line[cur_line.find('}') + 1:] # Get everything after the close bracket
                        break
                    elif ',' in cur_line: # Found ',' before '}': simple assignment
                        break

                    cur_line = next(code)

            if '}' in cur_line and '--' not in cur_line:
                return

            cur_line = next(code)

    def process_db(self):
        return

    def process_voice_line(self, code, cur_line):
        """Converts the `Cue` object starting at cur_line from code to an object"""
        cur_object = dict()
        while True:
            Ingestion.set_key_values(cur_line, cur_object) # Consume assignments from line
            
            if '}' in cur_line: # Done with this assignment
                return cur_object
            
            cur_line = next(code)

    def set_key_values(line, object: dict):
        """Extracts assignments in `line` into object"""
        while '=' in line: # More assignments exist in remaining line
            key, value, line = Ingestion.consume_assignment_in_line(line)
            object[key] = value

    def consume_assignment_in_line(line: str):
        """Pulls out the first assignment in a line and returns the remaining line"""
        end_assignment = line.find('=') # Find the end of the assignment statement
        name = line[:end_assignment].strip()

        line = line[end_assignment + 1:].strip() # Advance line past assignment

        comma_loc = line.find(',')
        quote_loc = line.find('"')
        if quote_loc < comma_loc and quote_loc >= 0: # String assigned
            closing_quote_loc = line[quote_loc + 1:].find('"')
            value = line[quote_loc + 1:closing_quote_loc + 1].strip() # Slice value between quotes
            line = line[closing_quote_loc + 1:] # Advance line past the closing quote
            closing_comma_loc = line.find(',') # Find closing comma of this assignment
            line = line[closing_comma_loc + 1:].lstrip() # Advance line past closing comma

        else: # Non-string assigned
            value = line[:comma_loc].strip()
            line = line[comma_loc:]

        return (name, value, line)

def get_speaker_from_name(line_name):
    if 'Zagreus' in line_name:
        return 'Zagreus'
    else:
        return line_name[4:line_name.find('_')]

if __name__ == '__main__':
    sqllite_ingestion = SqliteIngestionDB('hades-index.db')
    npc_ingest = Ingestion('raw-data/NPCData.lua', sqllite_ingestion)
