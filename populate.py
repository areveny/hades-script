import sqlite3

con = sqlite3.connect('hades-index.db')

cur = con.cursor()

cur.execute('DROP TABLE lines')

cur.execute('CREATE TABLE lines (speaker text, text text)')

cur.execute('INSERT INTO lines VALUES ("Zagreus", "Hello huntress."), ("Artemis", "Hello hunter.")')

con.commit()
con.close()


def print_db():
    con = sqlite3.connect('hades-index.db')

    cur = con.cursor()

    for row in cur.execute('SELECT * FROM lines'):
        print(row)

