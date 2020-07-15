using System;
using System.Collections.Generic;

namespace Template.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Gender { get; set; }
        public DateTime DOB { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int LiteracyId { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        
        public Employee()
        {

        }

        public Employee(int id, string code, string firstName, string lastName, bool gender, DateTime dOB, string email, string phone, string address, int literacyId, string description, int status)
        {
            this.Id = id;
            this.Code = code;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.Gender = gender;
            this.DOB = dOB;
            this.Email = email;
            this.Phone = phone;
            this.Address = address;
            this.LiteracyId = literacyId;
            this.Description = description;
            this.Status = status;
        }

        public IEnumerable<Employee> FillData()
        {
            return new List<Employee>
            {
                new Employee(1, "E01", "Quản Quốc", "Việt", false, new DateTime(1997, 2, 26), "qquocviet2602@gmail", "0387681114", "Hai Bà Trưng, Hà Nội", 3, "<p><b>Vui tính, Hòa đồng</b></p>", 1),
                new Employee(2, "E02", "Nguyễn Minh", "Tuấn", false, new DateTime(1996, 4, 10), "tuannm@gmail", "0345346981", "Sơn La", 1, "<p><i>Điềm tĩnh</i></p>", 1),
                new Employee(3, "E03", "Vũ Tuấn", "Anh", false, new DateTime(1991, 10, 2), "anhvt@gmail", "0935860528", "Hòa Bình", 2, "<p><b>Thích chơi game</b></p>", 0),
                new Employee(4, "E04", "Hoàng Khánh", "Linh", true, new DateTime(1989, 10, 12), "linhhk@gmail", "0905123390", "Nam Định", 1, "<p><b>Thích chạy bộ, nghe nhạc</b></p>", 1),
                new Employee(5, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(6, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(7, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(8, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(9, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(10, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(11, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(12, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(13, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(14, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
                new Employee(15, "E05", "Phạm Phương", "Anh", true, new DateTime(1993, 2, 3), "anhpp@gmail", "0969926961", "Hồ Chí Minh", 2, "<p><b>Năng động</b></p>", 0),
            };
        }
    }
}