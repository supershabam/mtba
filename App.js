import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function App() {
  const [db, setDB] = useState(null)
  const [status, setStatus] = useState('')

  const onPressInsert = () => {
    if (!db) {
      return
    }
    const now = new Date()
    db.exec([
      {
        sql: `INSERT INTO hello_worlds (at) VALUES (?)`,
        args: [
          now.getTime()
        ]
      }
    ], false, (err) => {
      if (err) {
        setStatus(`while inserting: ${err}`)
        return
      }
      setStatus(`logged entry at=${now}`)
    })
  }

  useEffect(() => {
    let run = async () => {
      const db = SQLite.openDatabase('greetings.db')
      const create = await new Promise((resolve, reject) => {
        db.exec([
          {
            sql: `
              CREATE TABLE IF NOT EXISTS hello_worlds (
                at NUMERIC PRIMARY KEY ASC ON CONFLICT REPLACE
              )`,
            args: []
          }
        ], false, (err, result) => {
          if (err) {
            return reject(`while creating table: ${err}`)
          }
          resolve(result)
        })
      })
      setDB(db)
      return "ready to log"
    }
    run().then((status)=> {
      setStatus(status)
    }, (err) => {
      setStatus(`err=${err}`)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>status={status}</Text>
      <Button
        onPress={onPressInsert}
        title="Insert"
        color="#841584"
        accessibilityLabel="Insert item into database"
/>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
