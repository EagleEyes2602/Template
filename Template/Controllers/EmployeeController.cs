using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Template.Models;
using Newtonsoft.Json;

namespace Template.Controllers
{
    public class EmployeeController : Controller
    {
        // GET: Employee
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Paging(int pageCount = 1, int pageSize = 10)
        {
            var model = new EmployeeViewModel();
            var employee = new Employee();
            var literacy = new Literacy();
            int lowwerRecord = (pageCount < 1 ? 1 : pageCount - 1) * pageSize;
            //int upperRecord = lowwerRecord + pageSize;
            var lstEmp = employee.FillData();
            var lstEmpFilter = lstEmp.Skip(lowwerRecord).Take(pageSize);
            model.Employees = JsonConvert.SerializeObject(lstEmpFilter);
            model.TotalRecord = lstEmp.Count();
            model.PageCount = pageCount;
            model.PageSize = pageSize;
            model.MaxPage = 5;
            return Json(new { data = JsonConvert.SerializeObject(lstEmpFilter), totalRecord = lstEmp.Count() }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Sortable()
        {
            return View();
        }

        public ActionResult Sortable2()
        {
            return View();
        }

        public ActionResult TableSortable()
        {
            return View();
        }
    }
}