const keywordExplanations: { keyword: string; explanation: string }[] = [
  {
    keyword: "pink bourbon",
    explanation: "สายพันธุ์ที่มีความหวานและกลิ่นดอกไม้โดดเด่น",
  },
  {
    keyword: "geisha",
    explanation: "สายพันธุ์ที่มีกลิ่นดอกไม้และความซับซ้อนสูง",
  },
  {
    keyword: "natural",
    explanation: "แปรรูปโดยตากทั้งผล ทำให้รสชาติผลไม้เด่นชัด",
  },
  {
    keyword: "washed",
    explanation: "สะอาด โปร่ง รสชาติชัดเจน",
  },
  {
    keyword: "honey",
    explanation: "หวานนุ่ม มีความซับซ้อนมากขึ้น",
  },
];

export const fieldExplanations = {
  producer: "ผู้ปลูกหรือผู้ดูแลแหล่งผลิต",
  origin: "ประเทศหรือแหล่งที่มาของวัตถุดิบ",
  region: "พื้นที่ปลูกหรือพื้นที่ผลิต",
  altitude: "ระดับความสูงของแหล่งปลูก ซึ่งมีผลต่อความซับซ้อนของรสชาติ",
  variety: "สายพันธุ์ของกาแฟหรือวัตถุดิบ",
  process: "วิธีแปรรูปที่ส่งผลต่อกลิ่นและรสชาติ",
  roastLevel: "ระดับการคั่ว",
  brewRecommendation: "วิธีดื่มหรือวิธีชงที่เหมาะกับตัวนี้",
  availableFor: "เมนูที่เหมาะกับวัตถุดิบนี้",
  seasonalAvailability: "ช่วงเวลาที่มีให้ดื่ม",
};

export function explainTerm(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.toLowerCase();

  return keywordExplanations.find((item) =>
    normalizedValue.includes(item.keyword),
  )?.explanation;
}
