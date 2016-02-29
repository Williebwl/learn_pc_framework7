using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApi.Models.Auth
{
    using BIStudio.Framework.UI;

    public class LoginVM : ViewModel
    {
        public string LoginName { get; set; }

        public string Password { get; set; }
    }
}