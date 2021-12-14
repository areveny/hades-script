import sqlite3 

class IngestionDB():

    def can_process_object(self, object):
        raise NotImplemented

    def process_object(self, object):
        raise NotImplemented

class SqliteIngestionDB(IngestionDB):

    def __init__(self, db_file):
        self.db_file = db_file
        self.initialize()

    def initialize(self):
        con = sqlite3.connect(self.db_file)
        with con:
            con.execute("""DROP TABLE lines;""")
            con.execute("""CREATE TABLE lines (
            line_name TEXT PRIMARY KEY,
            conversation_name TEXT,
            speaker TEXT,
            text TEXT
            );
            """)
            con.execute("""CREATE INDEX speaker ON lines (speaker, conversation_name);""")
            con.execute("""CREATE INDEX conversations ON lines (conversation_name, speaker);""")
        con.close()

    def can_process_object(self, obj):
        return obj and isinstance(obj, dict) and 'Cue' in obj and 'Text' in obj

    def process_lines_dataset(self, line_data):
        db_values = [(line_data['line_name'], line_data['conversation_name'], line_data['speaker'], line_data['text'])]

        con = sqlite3.connect(self.db_file)
        with con:
            con.executemany('INSERT INTO lines (line_name, conversation_name, speaker, text) VALUES (?, ?, ?, ?)', db_values)
        con.close()

if __name__ == '__main__':
    con = sqlite3.connect('hades-index.db')
    