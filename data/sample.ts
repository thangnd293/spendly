export type Transaction = {
  id: string;
  type: 'spend';
  occuredAt: string;
  amountVnd: number;
  title: string;
  note?: string;
};

export const groupedTransaction: {
  date: string;
  totalAmountVnd: number;
  transactions: Transaction[];
}[] = [
  {
    date: '2026-09-26',
    totalAmountVnd: 450000,
    transactions: [
      {
        id: '4',
        type: 'spend',
        occuredAt: '2026-09-23T20:00:00',
        amountVnd: 450000,
        title: 'Đi nhậu',
        note: 'Quán nhậu với bạn',
      },
      {
        id: '5',
        type: 'spend',
        occuredAt: '2026-09-24T09:00:00',
        amountVnd: 30000,
        title: 'Cafe sáng',
        note: 'Highlands Coffee',
      },
    ],
  },
  {
    date: '2026-09-25',
    totalAmountVnd: 80000,
    transactions: [
      {
        id: '3',
        type: 'spend',
        occuredAt: '2026-09-22T12:15:00',
        amountVnd: 80000,
        title: 'Ăn trưa',
        note: 'Cơm văn phòng',
      },
    ],
  },
  {
    date: '2026-09-21',
    totalAmountVnd: 250000,
    transactions: [
      {
        id: '2',
        type: 'spend',
        occuredAt: '2026-09-21T18:45:00',
        amountVnd: 250000,
        title: 'Đi xem phim',
        note: 'CGV Vincom',
      },
    ],
  },
  {
    date: '2026-09-20',
    totalAmountVnd: 120000,
    transactions: [
      {
        id: '1',
        type: 'spend',
        occuredAt: '2026-09-20T10:30:00',
        amountVnd: 120000,
        title: 'Ăn sáng',
        note: 'Phở bò + cà phê',
      },
    ],
  },
];

type SampleCategory = {
  id: string;
  name: string;
  kind: 'spend';
  parentId: string;
  icon: string;
};

export const SAMPLE_CATEGORIES: SampleCategory[] = [
  {
    id: 'cat_food',
    name: 'An uong',
    kind: 'spend',
    parentId: 'cat_root',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_sport',
    name: 'The thao',
    kind: 'spend',
    parentId: 'cat_root',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_move',
    name: 'Đi lại',
    kind: 'spend',
    parentId: 'cat_root',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_move_grab',
    name: 'Grab / taxi',
    kind: 'spend',
    parentId: 'cat_move',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_move_fuel',
    name: 'Xang xe',
    kind: 'spend',
    parentId: 'cat_move',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_move_parking',
    name: 'Gui xe',
    kind: 'spend',
    parentId: 'cat_move',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_move_flight',
    name: 'Ve may bay',
    kind: 'spend',
    parentId: 'cat_move',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_bill',
    name: 'Hoa on & Tien ich',
    kind: 'spend',
    parentId: 'cat_root',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_bill_rent',
    name: 'Thue nha',
    kind: 'spend',
    parentId: 'cat_bill',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_bill_water',
    name: 'Hoa đon nước',
    kind: 'spend',
    parentId: 'cat_bill',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_bill_power',
    name: 'Hoa đơn đien',
    kind: 'spend',
    parentId: 'cat_bill',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_bill_phone',
    name: 'Hoa đơn điện thoại',
    kind: 'spend',
    parentId: 'cat_bill',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_bill_internet',
    name: 'Hoa don internet',
    kind: 'spend',
    parentId: 'cat_bill',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_shop',
    name: 'Mua sam',
    kind: 'spend',
    parentId: 'cat_root',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_shop_clothes',
    name: 'Qun ao',
    kind: 'spend',
    parentId: 'cat_shop',
    icon: 'icon_119.png',
  },
  {
    id: 'cat_shop_tech',
    name: 'Đồ đien tử',
    kind: 'spend',
    parentId: 'cat_shop',
    icon: 'icon_119.png',
  },
];

export const PARENT_CATEGORIES: SampleCategory[] = [
  'Ăn uống',
  'Hóa đơn & Tiện ích',
  'Mua sắm',
  'Gia đình',
  'Di chuyển',
  'Sức khỏe',
  'Giáo dục',
  'Giải trí',
  'Quà tặng & Quyên góp',
  'Bảo hiểm',
  'Đầu tư',
].map((name, index) => ({
  id: 'cat_' + index,
  name,
  kind: 'spend',
  parentId: 'cat_root',
  icon: 'icon_19.png',
}));
