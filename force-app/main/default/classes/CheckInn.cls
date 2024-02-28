public without sharing class CheckInn {
    
    @AuraEnabled 
    public static String signUpUser(String firstName, String lastName, String email, String Phone, String Password) {
        
        Account acc = new Account();
        acc.Name = firstName + ' ' + lastName;
        acc.Email__c = email;
        acc.Phone =Phone;
        insert acc;
        
        Contact con = new Contact();
        con.AccountId = acc.Id;
        con.FirstName = firstName;
        con.LastName = lastName;
        con.Email = email;
        con.Phone =Phone;
        insert con;
        
        
        User user = new User();
        user.Username = email;
        user.ContactId = con.Id;
        user.LastName = lastName;
        user.FirstName = firstName;
        user.Email = email;
        user.Alias = 'U-' + String.valueOf(Crypto.getRandomInteger()).substring(0, 6);
        user.CommunityNickname = email;
        user.TimeZoneSidKey = 'GMT';
        user.LocaleSidKey = 'en_US';
        user.EmailEncodingKey = 'UTF-8';
        Profile desiredProfile = [SELECT Id FROM Profile WHERE Name = 'CheckInn Admin' LIMIT 1];
        user.ProfileId = desiredProfile.Id;
        user.LanguageLocaleKey = 'en_US';
        user.IsActive = true;
        // user.ManagerId='2F0055j00000874WS';
        insert user;
        
        System.setpassword(user.Id,Password);
        
        // site.login(user.Username,Password,'/sms/s');
        return 'user created successfully';
        
    }
    
    //Fetch the Hotel Details
    @AuraEnabled
    public static List<Hotel__c> hotelInfo(){
        List<Hotel__c> hotelList = [Select Id,Name,Address__c,Description__c,Email__c,Phone__c,Total_Rooms__c From Hotel__c];
        return hotelList;
    }
    
   
    //Fetch the Rooms Details which are available & for Pagination Used Limit , OFFSET
    @AuraEnabled 
    public static List<Room__c>roomInfo(Integer offset, Integer pageSize){
        List<Room__c> roomList = [Select Id,Name,Hotel__r.Name,Rate__c,Room_Image__c,Room_Type__c,Status__c From Room__c LIMIT :pageSize OFFSET :offset];
        return roomList;
    }
    
   // To get Total Number of Rooms
    @AuraEnabled
    public static Integer roomCount(){
        return [Select Count() From Room__c];
    }
    //To show Room
     @AuraEnabled 
    public static List<Room__c>roomDetails(){
        List<Room__c> roomList = [Select Id,Name,Hotel__r.Name,Rate__c,Room_Image__c,Room_Type__c,Status__c From Room__c];
        return roomList;
    }
    
    //Book User with related to Account
    @AuraEnabled
    public static String BookWithRelatedAccount(String name, Integer totalMember, Datetime checkInDate,Datetime checkOutDate, Integer costValue,String roomId){
        String currentUserName = UserInfo.getUserName();
        Account currentUser = [Select Id,Name,Email__c From Account Where Email__c =: currentUserName Limit 1];
        Reservation__c res = new Reservation__c();
        res.Name = name;
        res.Total_Member__c = totalMember;
        res.Check_in_Date__c = checkInDate;
        res.Check_out_Date__c = checkOutDate;
        res.Total_Cost__c = costValue;
        res.Guest_Name__c = currentUser.Id;
        res.Room__c = roomId;
        insert res;
        return 'Reservation Done Succesffulyyy';
    }
    
    //To fetch Rate of Room
    @AuraEnabled
    public static List<Room__c> fetchRoomRate(String roomId){
        List<Room__c> roomList = [Select Id, Rate__c From Room__c Where Id =:roomId];
        System.debug('Room details '+roomList);
        return roomList;
    }
    
    //Fetch Reservation details
    @AuraEnabled(cacheable=true)
    public static List<Reservation__c> getReservation(){
        List<Reservation__c> resList = [SELECT Id, Name, Check_in_Date__c, Check_out_Date__c, Guest_Name__c, Guest_Name__r.Name, Room__c, Room__r.Name, Status__c, Total_Cost__c FROM Reservation__c];
        return resList;
    }
    
    //Insert Service Request
    @AuraEnabled
    public static String insertServiceRequest(String name, String subject, String description){
        
        String currentUserName = UserInfo.getUserName();
        Account userName = [Select Id,Name,Email__c from Account Where Email__c =:currentUserName Limit 1];
        
        Reservation__c res = [Select Id,Name, Guest_Name__c,Room__c From Reservation__c Limit 1];
        
        Service_Request__c sr = new Service_Request__c();
        sr.Name = name;
        sr.Subject__c = subject;
        sr.Description__c = description;
        sr.Guest__c = userName.Id;
        sr.Room__c = res.Room__c;
        insert sr;
        return 'Added Succesfully';
    } 
    
    //Show Services
    @AuraEnabled
    public static List<Service_Request__c> showServices(){
        List<Service_Request__c> showService = [Select Id, Name,Guest__c,Guest__r.Name,Room__c,Room__r.Name,Subject__c,Description__c From Service_Request__c];
        return showService;
    }
    
    //Insert Admin Reply
    @AuraEnabled
    public static String insertAdminReply(String replyValue, String serviceId) {
        List<Admin__c> adminList = new List<Admin__c>();
        
        Admin__c admin = new Admin__c();
        admin.Reply__c = replyValue;
        admin.Service_Request__c = serviceId;
        adminList.add(admin);
        
        if (!adminList.isEmpty()) {
            insert adminList;
        }
        
        return 'Reply inserted successfully';
    }
    
    //Show Admin reply to User
    @AuraEnabled
    public static List<Admin__c> showAdminReply(){
        List<Admin__c> adminList = [Select Id, Reply__c,Service_Request__r.Name From Admin__c];
        return adminList;
    }
    
    //Insert Room From Admin Side
    @AuraEnabled
    public static String insertRoom(String type, String status, Integer rate){
        List<Room__c> hotelList = new List<Room__c>();
        
        Hotel__c hotel = [Select Id,Name From Hotel__c];
        
        Room__c room = new Room__c();
        room.Room_Type__c = type;
        room.Status__c = status;
        room.Rate__c = rate;
        room.Hotel__c = hotel.Id;
        hotelList.add(room);
        
        if(!hotelList.isEmpty()){
            insert hotelList;
        }
        return 'Room Added Successfully';
    }
    
    //To Approve Action on Admin Page
    @AuraEnabled
    public static String updateStatusToApprove(String rowId, String actionName){
        
        String newStatus = (actionName =='Approve') ? 'Confirmed':'Canceled';
        
        Reservation__c res = new Reservation__c();
        res.Id = rowId;
        res.Status__c = newStatus;
        
        try {
            update res;
        } catch (Exception ex) {
            throw new AuraHandledException('Error updating status: ' + ex.getMessage());
        }
        
        return 'Update Successfully!';
    }
    
    //To Withdraw Reservation
    @AuraEnabled
    public static String withdrawReservation(String rowId){
        Reservation__c withdrawRes = [Select Id,Status__c From Reservation__c Where Id=:rowId Limit 1];
        if(withdrawRes.Status__c == 'Pending'){
            delete withdrawRes;
            return 'Withdraw Successfully!';
        }else{
            return 'Confirm Or Canceled Reservation Cannot Withdraw';
        }
    }
    
    
}