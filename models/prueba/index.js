const ActiveDirectory = require('activedirectory');
const SIZE_LIMIT = 10;

module.exports = {

    /***
    ***GET USERS
    ***/
    getUsers: (user) => {
        return new Promise ((resP, rejP) => {

            var config = { url: 'ldap://corp.ute.com.uy:389',
                        baseDN: 'dc=corp,dc=ute,dc=com,dc=uy',
                        username: 'NTUTE\\D418342',
                        password: 'Matiguz3' }
                        
            var ad = new ActiveDirectory(config);

            var opts = {
                filter: '(|(SAMAccountName='+ user +'*)(displayname=' + user + '*))',
                sizeLimit: SIZE_LIMIT,
              };
 
            ad.findUsers(opts, true, function(err, users) {
                let result;
                if (err) {
                    result = {"resultado" : 0, "mensaje" : JSON.stringify(err)};
                    return rejP(result)
                }
                
                if ((! users) || (users.length == 0)) {
                    result = {"resultado" : 0,"mensaje" : JSON.stringify(err)};
                    return rejP(result)
                } 
                
                result = {
                    "resultado" : 1,
                    "users" : []
                };
                for (let index = 0; index < users.length; index++) {
                    result["users"][index] = {
                        "ut" : users[index]["sAMAccountName"],
                        "name": users[index]["displayName"]
                    }
                }
                return resP(result);
            });
            
        })
    }
}