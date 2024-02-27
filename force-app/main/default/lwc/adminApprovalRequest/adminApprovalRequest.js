import { LightningElement,track,wire } from 'lwc';
import getReservation from '@salesforce/apex/CheckInn.getReservation';
import updateStatusToApprove from '@salesforce/apex/CheckInn.updateStatusToApprove';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Name', fieldName: 'Name',initialWidth: 130, cellAttributes:{class:'datatable-CellColor'}},
    { label: 'Room', fieldName: 'roomName',initialWidth: 80},
    { label: 'Check in Date', fieldName: 'Check_in_Date__c' },
    { label: 'Check out Date', fieldName: 'Check_out_Date__c' },
    { label: 'Status', fieldName: 'Status__c', initialWidth: 100,type: 'text', cellAttributes:{class:{fieldName:'statusColor'}  } },
    { label: 'Total Cost', fieldName: 'Total_Cost__c',initialWidth: 100 },
    {
        type: "button", label: 'Approve', initialWidth: 120, typeAttributes: {
            label: 'Approve',
            name: 'Approve',
            title: 'Approve',
            disabled: false,
            value: 'Approve',
            iconPosition: 'left',
            iconName:'utility:success',
            variant:'success',
        }
    },
    {
        type: "button", label: 'Reject', initialWidth: 120, typeAttributes: {
            label: 'Reject',
            name: 'Reject',
            title: 'Reject',
            disabled: false,
            value: 'Reject',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'destructive'
        }
    },

];

export default class AdminApprovalRequest extends LightningElement {
    columns = columns;
    @track reservData;
    @track wiredReservation;

    @wire(getReservation)
    wiredGetReservation(result){
        this.wiredReservation = result;
        if(result.data){
            this.reservData = result.data.map(item=>{
                let statusColor = item.Status__c =='Pending' || item.Status__c =='Canceled' ? 'slds-text-color_error':'slds-text-color_success'
                console.log('status color',statusColor)
                return{...item,
                    "statusColor":statusColor,
                    roomName: item.Room__r ? item.Room__r.Name: ''
                }
            })
        }else if(result.error){
            console.log(error);
        }
    }

    @track rowId;
    @track actionNamee;
    callRowAction(event) {
        const recId = event.detail.row.Id;
        console.log('recId ',recId);
        this.rowId = recId;
        console.log('recId d',this.rowId);

        const actionName = event.detail.action.name;
        this.actionNamee = actionName;
        console.log('actionName ',this.actionNamee);

        if (actionName === 'Approve') {
            this.handleApproveAction();
        } else if (actionName === 'Reject') {
            this.handleApproveAction();
        } 
    }

    handleApproveAction(){
        updateStatusToApprove({rowId:this.rowId,actionName:this.actionNamee })
        .then(result=>{
            console.log(result);
            return refreshApex(this.wiredReservation);

        }).catch(error=>{
            console.log(error);
        })

    }

}