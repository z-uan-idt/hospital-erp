import type { IChoice, IdName } from './core.types'
import type { IBasicAccount } from './account.types'

export interface IMedicalProduct {
  id?: number
  source?: IChoice
  real_quantity?: number | null
  available_quantity?: number | null
  expired_date?: string | null
  LoaiHangHoa?: IChoice
  NhomHangHoa?: IdName | null
  TrangThai?: IdName | null
  organization?: IdName | null
  DuongDung?: IdName | null
  DonViDGNN?: IdName | null
  DonViThuongDung?: IdName | null
  LoaiDangKy?: IdName | null
  DonViNhap?: IdName | null
  CongTyDangKy?: IdName | null
  NuocSanXuat?: IdName | null
  NhaSanXuat?: IdName | null
  PhanLoaiHangHoa?: IdName | null
  TenCSKCB?: IdName | null
  PhanLoaiCSKCB?: IdName | null
  LoaiBenhAn?: IdName | null
  LoaiThanhToan?: IdName | null
  PhuThuBaoHiem?: IdName | null
  DonViThau?: IdName | null
  created_by?: IBasicAccount | null
  updated_by?: IBasicAccount | null
  updated_at?: string | null
  created_at?: string | null
  image?: string | null
  TenHangHoa?: string | null
  BYT_TenHangHoa?: string | null
  MaHangHoa?: string | null
  BYT_MaHangHoa?: string | null
  LoaiHang?: string | null
  Barcode?: string | null
  HoatChat?: string | null
  HamLuong?: string | null
  TenHoatChatSDK?: string | null
  QuyCach?: string | null
  SoNgayCanHan?: number | null
  DangBaoChe?: string | null
  SoDangKy?: string | null
  HoaHong?: number | null
  LoiNhuan?: number | null
  MaHangHoaLienKet?: string | null
  ThongTu30?: string
  ThongTu40?: string | null
  MaACT?: string | null
  GhiChu?: string | null
  NamThau?: number | null
  NhomThau?: string | null
  GoiThau?: string | null
  LoaiThau?: string | null
  SoNgayVuotThau?: number | null
  SoLuongTrungThau?: number | null
  ThongTinHopDong?: string | null
  ThongTinThau?: string | null
  SoQuyetDinh?: string | null
  NgayQuyetDinh?: string | null
  NgayHieuLuc?: string | null
  NgayHetHieuLuc?: string | null
  DonGia?: number | null
  TiLeThanhToanBHYT?: number | null
  IsQLSoLo?: boolean | null
  IsQLHanDung?: boolean | null
  IsBHYT?: boolean | null
  IsHienThiWeb?: boolean | null
  IsSendBYT?: boolean | null
  LuongDung?: string | null
  DonViDung?: string | null
  LanDung?: string | null
  MoiLanDung?: string | null
}

export type IMedicalProductType = 'THUOC' | 'VAT_TU' | 'HOA_CHAT'

export type IMedicalProductFormPayload = {
  source?: 'HIS' | 'SELF'
  delete_image?: string | null
  LoaiBenhAn?: number[]
  LoaiThanhToan?: number[]
  LoaiHangHoa?: IMedicalProductType | null
  TenHangHoa?: string | null
  BYT_TenHangHoa?: string | null
  MaHangHoa?: string | null
  BYT_MaHangHoa?: string | null
  HamLuong?: string | null
  TenHoatChatSDK?: string | null
  QuyCach?: string | null
  SoNgayCanHan?: number | null
  DangBaoChe?: string | null
  SoDangKy?: string | null
  HoaHong?: number | null
  LoiNhuan?: number | null
  MaHangHoaLienKet?: string | null
  TiLeThanhToanBHYT?: number | null
  IsBHYT?: boolean | null
  ThongTu30?: string | null
  ThongTu40?: string | null
  MaACT?: string | null
  IsQLSoLo?: boolean | null
  IsQLHanDung?: boolean | null
  IsHienThiWeb?: boolean | null
  IsSendBYT?: boolean | null
  GhiChu?: string | null
  IsHangHoaKeDon?: boolean | null
  IsThau?: boolean | null
  NamThau?: number | null
  NhomThau?: string | null
  SoNgayVuotThau?: number | null
  SoLuongTrungThau?: number | null
  ThongTinHopDong?: string | null
  LoaiThau?: string | null
  GoiThau?: string | null
  ThongTinThau?: string | null
  SoQuyetDinh?: string | null
  NgayQuyetDinh?: string | null
  NgayHieuLuc?: string | null
  NgayHetHieuLuc?: string | null
  DonGia?: number | null
  Barcode?: string | null
  GiaBHYT?: number | null
  GiaDichVu?: number | null
  LuongDung?: string | null
  DonViDung?: string | null
  LanDung?: string | null
  MoiLanDung?: string | null
  organization?: number | null
  LoaiDangKy?: number | null
  NhomHangHoa?: number | null
  HoatChat?: number | null
  DuongDung?: number | null
  CongTyDangKy?: number | null
  NuocSanXuat?: number | null
  NhaSanXuat?: number | null
  TrangThai?: number | null
  PhanLoaiHangHoa?: number | null
  TenCSKCB?: number | null
  PhanLoaiCSKCB?: number | null
  PhuThuBaoHiem?: number | null
  DonViThau?: number | null
  DonViDGNN?: number | null
  DonViThuongDung?: number | null
  DonViNhap?: number | null
  image?: string | null
  image_file?: File | null
}
