import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import { Header, Icon, Input, Button, ListItem } from 'react-native-elements';
import { useEffect, useState } from 'react';
import * as SQLite from'expo-sqlite';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);
  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',  [product, amount]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
      setShoppinglist(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
    }, null, updateList)    
  }

  renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
    );

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
      />
      <Input
        placeholder='Product' label='PRODUCT'
        onChangeText={product => setProduct(product)} value={product}
      />
      <Input
        placeholder='Amount' label='AMOUNT'
        onChangeText={amount => setAmount(amount)} value={amount}
      />
      <Button raised icon={{name: 'save'}} onPress={saveItem} title="SAVE" />
      <FlatList
        style={{marginLeft: "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Text>{item.product}, {item.amount} </Text>
            <Icon type="material" color="red" name="delete" onPress={() => deleteItem(item.id)}/>
          </View>}
        data={shoppinglist}
      />
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
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});