## Schemas

## User
    -firstname : string
    -lastname : string
    -email : string
    -password : string
    -Address : [
        -address(from address schema)
    ]
    -Orders : [{address: (from address schema)}]

## Product
    -name:string
    -strickerPrice:Number    
    -markedPrice:Number
    -category:Category(from category schema)
    -image:string(URL)
    -compatibleWith  : [ "iPhone13", "iPhone12", "Apple Watch"]
    -stock:Number
    -color:String
    -weight:string
    -mfd:Number(year manufactured in)

## Category
    -name:string
    -description:string

## Order
    -address : Adress (from address schema)
    -user : User (from user schema)
    -products : [ product: Product (from Product Schema) ]
    -total : Number
    -status : [ "payment_pending", "payment_success", "payment_errored"]      

## Address  
    -houseNumber: String
    -fullAddress: String
    -landmark: String