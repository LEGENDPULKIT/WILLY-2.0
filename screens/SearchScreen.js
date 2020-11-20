import React from 'react';
import { StyleSheet, Text, View, FlatList,TextInput,TouchableOpacity } from 'react-native';
import * as firebase from 'firebase'
import db from '../config';
import {ScrollView} from 'react-native-gesture-handler'

export default class SearchScreen extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
                allTransactions:[],
                lastVisibleTransaction:null,
                search:'',
        }
    }
    componentDidMount = async ()=>{ 
        const query = await db.collection("Transactions").limit(10).get() 
    query.docs.map((doc)=>{ this.setState({ allTransactions: [], lastVisibleTransaction: doc }) }) }
    fetchMoreTransactions=async()=>
    {
        var text=this.state.search
        var enteredText=text.split("")
        if(enteredText[0]==='B')
        {
            const query=await db.collection("Transactions").where('BookId','==',text)
            .startAfter(this.state.lastVisibleTransaction).get()
            query.docs.map((doc)=>
            {
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc,

                })
            })
        }
        else if(enteredText[0]==='S')
        {
            const query=await db.collection("Transactions").where('StudentId','==',text)
            .startAfter(this.state.lastVisibleTransaction).limit(10).get()
            query.docs.map((doc)=>
            {
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc,

                })
            })
        }
    }

    searchTransactions=async(text)=>
    { 
        var text=text.toUpperCase()
        var enteredText=text.split("")

        if(enteredText[0].toUpperCase()==='B')
        {
           const Transactions=await  db.collection("Transactions").where('BookId','==',text).get();
           Transactions.docs.map((doc)=>
            {
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc,

                })
            })
        }
        else if(enteredText[0].toUpperCase()==='S')
        {
           const Transactions=await  db.collection("Transactions").where('StudentId','==',text).get();
           Transactions.docs.map((doc)=>
            {
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc,

                })
            })
        }
    }
    //write SEARCH SCREEN
    render(){
        return(
                <View style={styles.Container}>
                    <View style={styles.searchBar}>
                        <TextInput
                        style={styles.bar}
                        placeholder='Enter StudentId or BookId'
                        onChangeText={(text)=>
                        {
                            this.setState({search:text})
                        }}/>
                        <TouchableOpacity style={styles.SearchButton}
                        onPress={()=>
                        {
                            this.searchTransactions()
                        }}>
                            <Text>SEARCH</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                    data={this.state.allTransactions}
                    renderItem={({item})=>
                    (
                        <View style={{borderBottomWidth:2,}}>
                            <Text>{"BookId: "+item.bookId}</Text>
                            <Text>{"StudentId: "+item.StudentId}</Text>
                            <Text>{"TransactionType: "+item.transactionType}</Text>
                            <Text>{"Date: "+item.date.toDate()}</Text>
                        </View>
                    )}
                    keyExtractor={(item,index)=>
                    index.toString()}
                    onEndReached={this.fetchMoreTransactions()}
                    onEndReachedThreshold={0.7}/>
                </View>
        )
    }

}

const styles=StyleSheet.create({
    Container:{
        flex:1,
        marginTop:20,
    },
    searchBar:
    {
        flexDirection:'row',
        height:40,
        width:"auto",
        borderWidth:0.5,
        alignItems:'center',
        backgroundColor:'gray',
    },
    bar:
    {
        borderWidth:2,
        height:30,
        width:300,
        paddingLeft:10,
    },
    SearchButton:
    {
        borderWidth:1,
        height:30,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'green',
    }
})