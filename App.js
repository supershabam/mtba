import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

export default function App() {
  const [ok, setOk] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let run = async () => {
      const db = SQLite.openDatabase('greetings.db')
      const create = new Promise((resolve, reject) => {
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
      return create
    }
    run().then(()=> {
      setOk(true)
      setStatus("run completed")
    }, (err) => {
      setOk(false)
      setStatus(`err=${err}`)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Ok={ok} status={status}</Text>
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
