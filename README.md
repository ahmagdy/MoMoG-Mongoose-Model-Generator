#MoMoG
Mongoose Model Generator as momog
A small tool thats help to write mongoose model for mongodb as quick as possible for saving time, and not worry so much about writing model just think about it how it will be look like and just do it in a second.

##Installing
```text
npm install -g momog
```

##Usage
prefix of using it is `momog`

####The Options :

| option        | stands for    | 
| ------------- |:-------------:| 
|    -n            |name of the mode| 
| -f or --field      |   name of the field      |  
 
 
#### Types:
 
| Shortcut        | stands for    | 
| ------------- |:-------------:| 
|    string          |String| 
|    num          |Number|  
|    date          |Date| 
|    arr          |Array| 
|    id          |ObjectId| 

 
####Fields Name Shortcuts:
| Shortcut        | stands for    | 
| ------------- |:-------------:| 
|    r          |required| 
|    u          |Unique|  
|    sf          |not select| 
|    def          |default value| 
|    ref          |referrence to other model| 



##Examples:
We Want to create a basic **user** model with: 

* User name field thats string , required and of course sould be unique
* Password thats should be string required and not unique also we don't need to  select it in any query
* PhoneNumber thats should be a string not required but unique and set default value for it 00000

Simply you will type

```text
momog -n user -f username string r u -f password string r sf -f phonenumber num u def 00000
```

and will create
```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phonenumber: {
        type: Number,
        unique: true,
        default: '00000'
    }
});
module.exports = mongoose.model('User', userSchema);
```
also will generate file with this code in the same directory called **user.js**

#### Another Example
we need to create **article** model with:

* Title of type string thats should be unique and required 
* Content of the article also string and required 
* Date of the article 
* The Publisher we just need the id

```text
momog -n article -f title string u r -f content string r -f date date r -f publisher id ref user
```

will generate :

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});
module.exports = mongoose.model('Article', articleSchema);
```
will generate file with this code in the same directory called **article.js**

##License:
[The MIT License](https://opensource.org/licenses/MIT)
