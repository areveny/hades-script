import typing
from ingestion_db import IngestionDB, SqliteIngestionDB


class Ingestion():

    def __init__(self, file, ingestion_db):
        self.names_stack = list()
        self.ingestion_db = ingestion_db

        f = open(file, 'r')
        self.code_lines = iter(f)
        root_context = dict()
        try:
            while True:
                self.process(next(self.code_lines), root_context)
        except StopIteration:
            return

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
        while True:
            # print(cur_line.strip())
            # print(self.names_stack)
            # print(cur_line.strip())
            cur_line = cur_line.strip()
            leading_symbol, leading_symbol_loc = Ingestion.next_symbol(cur_line)
            if leading_symbol is None:
                if len(cur_line) > 0:
                    return '', cur_line # There might be content that needs to be interpreted as a literal
                else:
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
                if 'Cue' in nested_context:
                    pass
                    print(self.names_stack[-1])
                    print(nested_context)
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
                line = cur_line[closing_quote_loc + 2:] # Advance line past the closing quote
                value = cur_line[leading_symbol_loc + 1:closing_quote_loc + 1].strip() # Slice value between quotes
                closing_comma_loc = line.find(',') # Find closing comma of this assignment
                closing_bracket_loc = line.find('}') # Find oossible bracket
                if closing_bracket_loc < closing_comma_loc:
                    closing_loc = closing_bracket_loc
                else:
                    closing_loc = closing_comma_loc + 1
                line = line[closing_loc:].lstrip() # Advance line past closing
                return line, value
            elif leading_symbol == ',':
                # If we detect no more content, .e.g. just ',', advance line. There might be more
                if leading_symbol_loc == 0:
                    cur_line = next(self.code_lines)
                    continue

                # If there is content, consume up to it
                # Case where remainder is '}' or more data after comma
                return cur_line[leading_symbol_loc + 1:], cur_line[:leading_symbol_loc].strip() # Return literal val

def get_speaker_from_name(line_name):
    if 'Zagreus' in line_name:
        return 'Zagreus'
    else:
        return line_name[4:line_name.find('_')]

if __name__ == '__main__':
    sqllite_ingestion = SqliteIngestionDB('hades-index.db')
    npc_ingest = Ingestion('raw-data/NPCData.lua', sqllite_ingestion)
