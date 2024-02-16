import { LightningElement,wire } from 'lwc';
import getReservation from '@salesforce/apex/CheckInn.getReservation';

const columns = [
    { label: 'Reservation Number', fieldName: 'Name' },
    { label: 'Name', fieldName: 'Guest_Name__c' },
    { label: 'Room', fieldName: 'Room__c' },
    { label: 'Check in Date', fieldName: 'Check_in_Date__c' },
    { label: 'Check out Date', fieldName: 'Check_out_Date__c' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Total Cost', fieldName: 'Total_Cost__c' },

];

export default class ReservationCheckInn extends LightningElement {
    error;
    columns = columns;

    @wire(getReservation)
    reservations;
}