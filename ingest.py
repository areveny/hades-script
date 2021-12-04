class Ingestion():

    def __init__(self, file):
        f = open(file, 'r')
        self.names_stack = list()
        self.data = dict()

        code = iter(f)
        self.populate(code)

    def populate(self, code):
        try:
            while code:
                cur_line = next(code)
                self.find_assignment_or_table(code, cur_line)
        except StopIteration:
            pass

    def find_assignment_or_table(self, code, cur_line):
        """Processes unassigned tables and assignments of tables to a name"""
        print(self.names_stack, cur_line)
        if "HadesFirstMeetingCont1" in self.names_stack:
            raise StopIteration
        while code:
            if '{' in cur_line and '--' not in cur_line: # Found unassigned table
                cur_line = '{'.join(cur_line.split('{')[1:]) # Get everything after the open bracket
                self.find_assignment_or_table(code, cur_line)
                cur_line = '}'.join(cur_line.split('}')[1:]) # Get everything after the open bracket

            if '=' in cur_line and '--' not in cur_line: # Found assignment
                split_line = cur_line.split(' =')
                candidate_name = split_line[0].strip()
                cur_line = ' ='.join(split_line[1:])

                # Try and find out if we have a table or a simple assignment
                while code:
                    if '{' in cur_line: # Table
                        cur_line = '{'.join(cur_line.split('{')[1:]) # Get everything after the open bracket
                        self.names_stack.append(candidate_name)
                        self.find_assignment_or_table(code, cur_line)
                        self.names_stack.pop()
                        cur_line = '}'.join(cur_line.split('}')[1:]) # Get everything after the open bracket
                        break
                    elif ',' in cur_line: # Found ',' before '}': simple assignment
                        break

                    cur_line = next(code)

            if '}' in cur_line and '--' not in cur_line:
                return

            cur_line = next(code)

if __name__ == '__main__':
    npc_ingest = Ingestion('raw-data/NPCData.lua')
