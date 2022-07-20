import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function App() {
  const [db, setDB] = useState(null)
  const [ok, setOk] = useState(false)
  const [status, setStatus] = useState('')

  const onPressInsert = () => {
    if (!db) {
      console.log('db not set, skipping!')
      return
    }
    db.exec([
      {
        sql: `INSERT INTO hello_worlds (at) VALUES (1234)`,
        args: []
      }
    ], false, (err, result) => {
      console.log('press')
      console.log(err)
      console.log(result)
      db.exec([
        {
          sql: `SELECT * FROM hello_worlds`,
          args: []
        }], true, (err, result) => {
          console.log('read')
          console.log(err)
          console.log(result)
        }
      )
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
      return "ah yeah"
    }
    run().then((status)=> {
      setOk(true)
      setStatus(status)
    }, (err) => {
      setOk(false)
      setStatus(`err=${err}`)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Ok={ok} status={status}</Text>
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
