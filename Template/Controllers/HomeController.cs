using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.IO.Compression;
using Template.Models;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace Template.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Temp()
        {
            return View();
        }

        /// <summary>
        /// 2.78
        /// TinyPng - 4.47
        /// </summary>
        /// <param name="scaleFactor"></param>
        /// <param name="sourcePath"></param>
        /// <param name="targetPath"></param>
        private void compressimagesize(double scaleFactor, Stream sourcePath, string targetPath)
        {
            using (var image = System.Drawing.Image.FromStream(sourcePath))
            {
                var imgnewwidth = (int)(image.Width * scaleFactor);
                var imgnewheight = (int)(image.Height * scaleFactor);
                var imgthumnail = new Bitmap(imgnewwidth, imgnewheight);
                var imgthumbgraph = Graphics.FromImage(imgthumnail);
                imgthumbgraph.CompositingQuality = CompositingQuality.HighQuality;
                imgthumbgraph.SmoothingMode = SmoothingMode.HighQuality;
                imgthumbgraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
                var imageRectangle = new Rectangle(0, 0, imgnewwidth, imgnewheight);
                imgthumbgraph.DrawImage(image, imageRectangle);
                imgthumnail.Save(targetPath, image.RawFormat);
            }
        }

        [HttpPost]
        public ActionResult Index(FormCollection formCollection)
        {
            foreach (string item in Request.Files)
            {
                HttpPostedFileBase file = Request.Files[item] as HttpPostedFileBase;
                if (file.ContentLength == 0)
                    continue;

                if (file.ContentLength > 0)
                {
                    file.SaveAs(Server.MapPath("~/Content/") + file.FileName);
                    var sourcePath = Server.MapPath("~/Content/") + file.FileName;
                    var lastDot = sourcePath.LastIndexOf('.');
                    var targetPath = sourcePath.Insert(lastDot, "-min");
                    string filename = Path.GetFileName(sourcePath);
                    Stream strm = System.IO.File.OpenRead(sourcePath);
                    var targetFile = targetPath;
                    compressimagesize(1, strm, targetFile);
                }
            }

            return View();
        }
    }
}