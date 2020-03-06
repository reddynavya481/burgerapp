import React,{ Component } from "react";
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css' 
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
class ContactData extends Component{
    state={
        orderForm:{
        name: {
            elementType:'input',
            elementConfig:{
                type:'text',
                placeholder:'ur name'
            },
            value:'',
            validation:{
                required:true
            },
            valid:false
        },
        place: {
            elementType:'input',
            elementConfig:{
                type:'text',
                placeholder:'ur place'
            },
            value:'',
            validation:{
                required:true,
                minLength:15,
                maxLength:15
            },
            valid:false
        },
    email:{
        elementType:'input',
        elementConfig:{
            type:'email',
            placeholder:'ur email'
        },
        value:'',
        validation:{
            required:true
        },
        valid:false
    },
    deliveryMethod: {
        elementType:'select',
        elementConfig:{
            options:[{value:'fastest',displayValue:'Fastest'},
            {value:'cheapest',displayValue:'Cheapest'}
        ]
    },
    value:'',
    validation:{
        required:true,
       
    },
    valid:false
        }},
        loading:false
    }
    orderHandler=(event)=>{
        event.preventDefault()
        this.setState( { loading: true } );
        const formData={};
        for (let formId in this.state.orderForm){
            formData[formId]=this.state.orderForm[formId].value
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData:formData
               
        }
        axios.post( '/orders.json', order )
            .then( response => {
                this.setState( { loading: false } );
                this.props.history.push('/');
            } )
            .catch( error => {
                this.setState( { loading: false } );
            } );
    }


    checkValidity(value,rules){
        let isValid=false;
        if(rules.required){
            isValid=value.trim()!=='';
        
        if(rules.minLength){
            isValid=value.length>=rules.minLength
        
        if(rules.maxLength){
            isValid=value.length<=rules.maxLength
        }
    }}


        return isValid
    }
    inputChangedHandler=(e,inputIdentifier)=>{
        const updatedOrderForm={
           ... this.state.orderForm
        }
        const updatedFormElement={...updatedOrderForm[inputIdentifier]}
        updatedFormElement.value=e.target.value
        updatedOrderForm[inputIdentifier]=updatedFormElement
        updatedFormElement.valid=this.checkValidity(updatedFormElement.value,updatedFormElement.validation)
        this.setState({orderForm:updatedOrderForm})
        
    }
    render(){
        const formElementsArray=[];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            })
        }
        let form =(
            <form onSubmit={this.orderHandler}>
                    {/* <Input elementType="..." elementConfig="..." value="..."/> */}
                    {/* <Input inputtype="input"  type="text" name="email" placeholder="your email"/>
                    <Input inputtype="input"  type="text" name="place" placeholder="your place"/> */}
                    {formElementsArray.map(formElement=>(
                        <Input key={formElement.id}elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value} changed={(e)=>this.inputChangedHandler(e,formElement.id)}/>
                    ))
                       
                }
                    <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
                </form>
        );
        if(this.state.loading){
            form=<Spinner/>
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter ur Contact Deatils</h4>
                {form}
            </div>
        )
    }
}

export default ContactData