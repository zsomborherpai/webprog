using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.ComponentModel;
using System.Xml.Resolvers;
using System.Security;

namespace fogadoora
{
    public struct Fogadoora
    {
        public string veznev;
        public string kernev;
        public DateTime idopont;
        public string foglalasido;
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            List<Fogadoora> lista = new List<Fogadoora>();
            Fogadoora f = new Fogadoora();
            foreach (var i in File.ReadAllLines("fogado.txt")) {
                string[] t = i.Split(' ');
                f.veznev = t[0];
                f.kernev = t[1];
                f.idopont = Convert.ToDateTime(t[2]);
                f.foglalasido = t[3];
                lista.Add(f);
            }
            //2.
            Console.WriteLine("foglalasok szama:"+lista.Count);

            //3.
            Console.WriteLine("Kerem a tanar nevet");
            string nev = Console.ReadLine();
            string[] n = nev.Split(' ');
            var idopontok=lista.Where(x => x.veznev == n[0] && x.kernev == n[1]).Count();
            var letezo = (idopontok == 0) ? "A megadott neven nincs idopontfoglalas!" : nev + "néven" + idopontok + "idopont foglalas";
            Console.WriteLine(letezo);

            //4.
            Console.WriteLine("Kerem a keresett idopontot!");
            DateTime d=Convert.ToDateTime(Console.ReadLine());
            var tanarok = lista.Where(x => x.idopont.Hour == d.Hour&&x.idopont.Minute == d.Minute).Select(x => x.veznev + " " + x.kernev).ToList();
            var rendezett = tanarok.OrderBy(x => x);
            File.WriteAllLines("idop.txt", rendezett);

            //5.
            var fogl=lista.Where(x => x.foglalasido.Contains("2017.11.06")).Count();
            Console.WriteLine("2017.11.06-i foglalasok szama" + fogl);

            //6.
            var be=lista.Where(x => x.veznev=="Barna"&&x.kernev=="Eszter").Select(x => x.idopont).ToList();
            Console.WriteLine("Barna és Eszter foglalt idopontjai:");
            foreach(var i in be)
            {
                Console.WriteLine(i);
            }
            double ora = (double)(be.Count * 10) / 60;
            Console.WriteLine("Megbeszéléssel eltöltött idő:"+ora);

            Console.ReadLine();
        }
    }
}
