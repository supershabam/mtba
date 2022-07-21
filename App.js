import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const datapoints = (db) => {
  return new Promise((resolve, reject) => {
    db.exec([
      {
        sql: `SELECT at FROM hello_worlds`,
        args: []
      }
    ], false, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      const rows = result[0].rows
      const times = rows.map((row) => {
        return row.at
      })
      resolve(times)
    })
  })
}

const updateLocal = (db, at) => {
  return new Promise((resolve, reject) => {
    db.exec([
      {
        sql: `INSERT INTO hello_worlds (at) VALUES (?)`,
        args: [
          at.getTime()
        ]
      }
    ], false, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

const updateRemote = async (db) => {
  const dp = await datapoints(db)
  const body = JSON.stringify({ats: dp})
  const response = await fetch('https://mtba-svc.fly.dev/api/datapoints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
  return response.json()
}

export default function App() {
  const [db, setDB] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const run = async ()=> {
      if (!db) {
        return
      }
      return await update(db)
    }
    run().then((ok) => {
      console.log(ok)
    }, (err) => {
      console.log(err)
    })
  }, [db])

  const onPressInsert = () => {
    if (!db) {
      return
    }
    const now = new Date()
    const run = async () => {
      await updateLocal(db, now)
      setStatus(`logged local entry at=${now}, now syncing to remote`)
      await updateRemote(db)
      setStatus(`logged and synced entry at=${now}`)
    }
    run().then(() => {}, (err) => {
      setStatus(`error=${err}`)
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
