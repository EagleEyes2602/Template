using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Template.Models;
using Newtonsoft.Json;
using System.Linq.Dynamic;

namespace Template.Controllers
{
    public class EmployeeController : Controller
    {
        // GET: Employee
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Trong này là hàm main load phân trang table.
        /// Mục đích chính là tạo template table
        /// Dùng List data thông thường thôi không có kết nối DB
        /// Dùng dynamic linq
        /// </summary>
        /// <param name="pageCount"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Paging(int pageCount = 1, int pageSize = 10, SortModel sort = null, List<WhereModel> filter = null)
        {
            var model = new EmployeeViewModel();
            var employee = new Employee();
            var literacy = new Literacy();
            string where = "";
            int lowwerRecord = (pageCount < 1 ? 1 : pageCount - 1) * pageSize;
            //int upperRecord = lowwerRecord + pageSize;
            var lstEmp = employee.FillData();
            if (sort != null)
            {
                if (sort.Direction == -1)
                {
                    lstEmp = lstEmp.OrderBy(sort.ColumnName + " ASC");
                }
                else if (sort.Direction == 1)
                {
                    lstEmp = lstEmp.OrderBy(sort.ColumnName + " DESC");
                }
            }
            if (filter != null)
            {
                foreach (WhereModel item in filter)
                {
                    if (!string.IsNullOrEmpty(where))
                    {
                        where += " and ";
                    }
                    if (item.DataType == "text")
                    {
                        // 0, 6
                        switch (item.SortType)
                        {
                            case 0:
                                where += item.Name + " = \"" + item.Value + "\"";
                                break;
                            case 6:
                                where += item.Name + ".Contains(\"" + item.Value + "\")";
                                break;
                            default:
                                break;
                        }
                    }
                    else if (item.DataType.ToLower() == "number")
                    {
                        // 0, 1, 2, 3, 4, 5
                        switch (item.SortType)
                        {
                            case 0:
                                where += item.Name + " =  " + item.Value;
                                break;
                            case 1:
                                where += item.Name + " >  " + item.Value;
                                break;
                            case 2:
                                where += item.Name + " >=  " + item.Value;
                                break;
                            case 3:
                                where += item.Name + " <  " + item.Value;
                                break;
                            case 4:
                                where += item.Name + " <=  " + item.Value;
                                break;
                            case 5:
                                where += item.Name + " >  " + item.Value;
                                break;
                            default:
                                break;
                        }
                    }
                    else if (item.DataType.ToLower() == "datetime")
                    {
                        // 0
                    }
                }
                lstEmp = lstEmp.Where(where).ToList();
            }
            var lstEmpFilter = lstEmp.Skip(lowwerRecord).Take(pageSize);
            model.Employees = JsonConvert.SerializeObject(lstEmpFilter.ToList());
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