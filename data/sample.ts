export type Transaction = {
  id: string;
  type: "spend";
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
    date: "2026-09-26",
    totalAmountVnd: 450000,
    transactions: [
      {
        id: "4",
        type: "spend",
        occuredAt: "2026-09-23T20:00:00",
        amountVnd: 450000,
        title: "Đi nhậu",
        note: "Quán nhậu với bạn",
      },
      {
        id: "5",
        type: "spend",
        occuredAt: "2026-09-24T09:00:00",
        amountVnd: 30000,
        title: "Cafe sáng",
        note: "Highlands Coffee",
      },
    ],
  },
  {
    date: "2026-09-25",
    totalAmountVnd: 80000,
    transactions: [
      {
        id: "3",
        type: "spend",
        occuredAt: "2026-09-22T12:15:00",
        amountVnd: 80000,
        title: "Ăn trưa",
        note: "Cơm văn phòng",
      },
    ],
  },
  {
    date: "2026-09-21",
    totalAmountVnd: 250000,
    transactions: [
      {
        id: "2",
        type: "spend",
        occuredAt: "2026-09-21T18:45:00",
        amountVnd: 250000,
        title: "Đi xem phim",
        note: "CGV Vincom",
      },
    ],
  },
  {
    date: "2026-09-20",
    totalAmountVnd: 120000,
    transactions: [
      {
        id: "1",
        type: "spend",
        occuredAt: "2026-09-20T10:30:00",
        amountVnd: 120000,
        title: "Ăn sáng",
        note: "Phở bò + cà phê",
      },
    ],
  },
];
