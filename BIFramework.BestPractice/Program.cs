using BIStudio.Framework;
using BIStudio.Framework.MQ;
using BIStudio.Framework.Data;
using BIStudio.Framework.Domain;
using BIStudio.Framework.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using BIStudio.Framework.BestPractice.Impl;
using System.ComponentModel.DataAnnotations;
using System.Collections.ObjectModel;
using BIStudio.Framework.Configuration;

namespace BIStudio.Framework.BestPractice
{
    class Program
    {
        static void Main(string[] args)
        {
            AppRuntime.Module
                .RegisterModule()
                .RegisterORMapping()
                .RegisterEFRepository();

            Console.WriteLine("1. 运行Data示例");
            Console.WriteLine("2. 运行Domain示例");
            Console.WriteLine("3. 运行CQRS示例");
            Console.WriteLine("4. 运行Actor示例");
            Console.WriteLine("");

            ISampleService service = null;
            char key = Console.ReadKey(true).KeyChar;
            if (key == '1')
            {
                service = new DALService();
            }
            else if (key == '2')
            {
                service = new DDDService();
            }
            else if (key == '3')
            {
                AppRuntime.Module
                        .RegisterMessageDispatcher();
                service = AppRuntime.Container.Resolve<ISampleService>();
            }
            else if (key == '4')
            {
                AppRuntime.Module
                        .RegisterMessageBroker()
                    .RegisterMessageDispatcher("127.0.0.1");
                service = AppRuntime.Container.Resolve<ISampleService>();
            }
            if (service != null)
            {
                Console.WriteLine(service.GetType().Name + " Running...");
                long orderID = service.CreateUser("张三");
                var order = service.FindUser("张三");
                Console.ReadKey(true);
            }
        }
    }
}
