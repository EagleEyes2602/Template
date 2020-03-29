using System.Collections.Generic;

namespace Template.Models
{
    public class Literacy
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public Literacy()
        {

        }

        public Literacy(int id, string code, string name)
        {
            this.Id = id;
            this.Code = code;
            this.Name = name;
        }

        public IEnumerable<Literacy> FillData()
        {
            return new List<Literacy>
            {
                new Literacy(1, "L01", "THPT"),
                new Literacy(2, "L02", "Cử nhân"),
                new Literacy(3, "L03", "Kỹ sư"),
                new Literacy(4, "L04", "Kiến trúc sư"),
                new Literacy(5, "L05", "Bác sĩ"),
                new Literacy(6, "L06", "Luật sư"),
                new Literacy(7, "L07", "Thạc sỹ"),
                new Literacy(8, "L08", "Tiến sĩ")
            };
        }
    }
}