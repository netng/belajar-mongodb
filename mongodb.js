db.createCollection("customers");

db.createCollection("products");

db.createCollection("orders");

db.getCollectionNames();

db.customers.find()

// insert one
db.customers.insertOne({
    _id: "kazu",
    name: "kazu"
})

// insert many
db.products.insertMany(
    [
        {
            _id: 3,
            name: 'pop mie rasa bakso',
            price: new NumberLong('2500'),
            category: 'food'
        },
        {
            _id: 4,
            name: 'samsung galaxy s9+',
            price: new NumberLong('10000000'),
            category: 'handphone'
        },
        {
            _id: 5,
            name: 'acer precator xxi',
            price: new NumberLong('25000000'),
            category: 'laptop'
        },
    ]
)

db.products.find({
    'price': {
        $gt: '2000'
    },
    'category': {
        $eq: 'handphone'
    }
})


db.products.find({
    'price': {
        $gt: 2000
    },
    'category': {
        $eq: 'handphone'
    },
})


// logical operator

// and
// sql: select * from products where category in ('handphone', 'laptop') and price > 2000
db.products.find({
    $and: [
        {
            category: {
                $in: ['handphone', 'laptop']
            }
        },
        {
            price: {
                $gt: 2000
            }
        }
    ]
})

// not
// sql: select * from products where category not in ('handphone', 'laptop');
db.products.find({
    category: {
        $not: {
            $in: ['handphone', 'laptop']
        }
    }
})

// nor
// sql: select * from products where category not in ('handphone', 'food')
db.products.find({
    $nor: [
        {
            category: {
                $in: ['handphone', 'food']
            }
        }
    ]
})

// element operator

// exists
// sql: select * from products where category is null
db.products.find({
    category: {
        $exists: false
    }
})

// type
// sql: select * from products where type(category) = 'string'
db.products.find({
    category: {
        $type: 'string'
    }
})

// sql: select * from products where type(category) in ('int', 'string')
db.products.find({
    price: {
        $type: ['int', 'long']
    }
})


// evaluation operator

// expr
// sql: select * from customers where _id = name
db.customers.find({
    $expr: {
        $eq: ["$_id", "$name"]
    }
})

// jsonSchema
// sql: select * from products where name is not null and category is not null and type(name) = 'string' and type(category) = 'string'
db.products.find({
    $jsonSchema: {
        required: ["name", "category"],
        properties: {
            name: {
                type: "string"
            },
            category: {
                type: "string"
            }
        }
    }
})

// mod
// sql: select * from products where price % 5 = 0
db.products.find({
    price: {
        $mod: [5, 0]
    }
})

db.products.find({
    price: {
        $mod: [1_000_000, 0]
    }
})

// regex
// sql: select * from products where name like "%mie%"
db.products.find({
    name: {
        $regex: /mie/,
        $options: 'i' // incasesensitive, don't care about upper or lower case letters
    }
})

// sql: select * from products where name like "mie%"
db.products.find({
    name: {
        $regex: /^mie/,
    }
})

// we can execute javascript function using $where,
// but simple function (comparator, ect)
// sql: select * from customer where _id = name
db.customers.find({
    $where: function() {
        return this._id == this.name
    }
})


// array operator

// lets insert another products that have a tags properties as array
db.products.insertMany(
    [
        {
            _id: 7,
            name: "logitech wireless mouse",
            price: new NumberLong("175000"),
            category: "laptop",
            tags: ["logitech", "mouse", "accessories"]
        },
        {
            _id: 8,
            name: "cooler pad gaming",
            price: new NumberLong("200000"),
            category: "laptop",
            tags: ["cooler", "laptop", "accessories", "fan"]
        },
        {
            _id: 9,
            name: "samsung curved monitor",
            price: new NumberLong("1750000"),
            category: "computer",
            tags: ["samsung", "monitor", "computer"]
        }
    ]
)

// $all
// sql: select * from products where (tags = "samsung" and tags = "monitor")
db.products.find({
    tags: {
        $all: ["samsung", "monitor"]
    }
})

// $elemMatch
// sql: selec * from products where tags in ("samsung", "logitech")
db.products.find({
    tags: {
        $elemMatch: {
            $in: ["samsung", "logitech"]
        }
    }
})

// $size
// sql: select * from products where count(tags) = 3
db.products.find({
    tags: {
        $size: 3
    }
})


// projection
// for selecting specific property,
// property _id will always selected

// sql: select name, category from products
db.products.find({}, {
    name: 1,
    category: 1
})

// sql: select name, price, category from products
// select all except tags
db.products.find({}, {
    tags: 0
})

// projection with operator
db.products.find({}, {
    name: 1,
    tags: {
        $elemMatch: {
            $in: ["samsung", "logitech"]
        }
    }
})

// select name, tags from products and only select first index from array tags
/** 
{
    _id: 1,
    name: 'something',
    tags: ['sometags']
}
*/
db.products.find({
    tags: {
        $exists: true
    }
}, {
    name: 1,
    "tags.$": 1
})

db.products.find({
    tags: {
        $exists: true
    }
}, {
    name: 1,
    tags: {
        $slice: 2 // index 0, 1
    }
})


// query modifiers

// count
// sql: select count(*) from products
db.products.find({}).count()

// limit
// sql: select * from products limit 4
db.products.find({}).limit(4)

// skip
// sql: select * from products offset 2
db.products.find({}).skip(2)

// combine limit & skip
// sql: select * from products limit 4 offset 2
db.products.find({}).limit(4).skip(2)

// sort
// sql: select * from products order by category asc, name desc
db.products.find({}).sort({
    category: 1, // 1 = asc
    name: -1 // -1 = desc
})


// update document function

// updateOne
// format
// db.<collection>.updateOne(
//     {}, // filter
//     {}, // update
//     {}, // options
// )
db.products.updateOne(
    {
        "_id": 1
    },
    {
        $set: {
            category: 'food'
        }
    },
    {}
)

db.products.updateOne(
    {
        "_id": 2
    },
    {
        $set: {
            category: 'food'
        }
    },
    {}
)

// updateMany
// sql: update products set tags = ['food'] where category = 'food' and tags is null
db.products.updateMany(
    {
        $and: [
            {
                category: 'food'
            },
            {
                tags: {
                    $exists: false
                }
            }
        ]
    },
    {
        $set: {
            tags: ['food']
        }
    }
)

// replaceOne
db.products.replaceOne(
    {
        _id: 0
    },
    {
        name: 'adinda sepatu lari oke',
        price: new NumberLong('1500000'),
        category: 'sepatu',
        tags: ['sepatu', 'lari', 'adidas']
    }
)


// Update document function

// $set
// update all products and set stock 0
db.products.updateMany(
    {},
    {
        $set: {
            stock: 0
        }
    }
)

// $inc
// update all products and increment stock 10
// sql: update products set stock = stock + 10
db.products.updateMany(
    {},
    {
        $inc: {
            stock: 10 // for decrement, use negatif (ex. -10)
        }
    }
)

// $rename
// sql: alter table products change name full_name
db.products.updateMany(
    {},
    {
        $rename: {
            name: 'full_name'
        }
    }
)

// $unset
// sql: alter table products drop column wrong
db.products.updateMany(
    {},
    {
        $unset: {
            wrong: ''
        }
    }
)

// $currentDate
db.products.updateMany(
    {},
    {
        $currentDate: {
            lastModifiedDate: {
                $type: 'date'
            }
        }
    }
)