using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace myoBlog29API.ViewModel
{
    public class CevapModel
    {
        public int CevapId { get; set; }
        public Nullable<int> UyeId { get; set; }
        public Nullable<int> MakaleId { get; set; }
        public Nullable<int> Cevap1 { get; set; }
        public int KatMakaleSay { get; set; }
    }
}