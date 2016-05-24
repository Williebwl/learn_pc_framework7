using System;
using System.Text;
using System.Web.Http;
using BIStudio.Framework;
using BIStudio.Framework.Auth;
using BIStudio.Framework.UI;
using Newtonsoft.Json;
using BIStudio.Framework.Utils;

namespace WebApi.Controllers.Auth
{

    public class LoginController : AppService
    {
        private const string ApiKey = "PAAS_Master";
        private const string Secret = "44678314ba0efa0c";

        private IAuthorizationService auth;

        [AllowAnonymous, HttpPost]
        public virtual string Login([FromBody]LoginVM vm)
        {
            if (vm == null) throw new HttpResponseException(System.Net.HttpStatusCode.BadRequest);

            var authorize = auth.Authorize(new SYSAuthorizeRequest(ApiKey));
            auth.AuthorizeLogin(new SYSAuthorizeLoginRequest(authorize.code, vm.LoginName, vm.Password));
            var token = auth.AccessToken(new SYSAccessTokenRequest(ApiKey, Secret, authorize.code));

            return "Basic " + JsonConvert.SerializeObject(token).ToBase64String();
        }
    }
}