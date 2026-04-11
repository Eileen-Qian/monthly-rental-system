/**
 * 取得場站資料（身分類別、登記區域皆由後端回傳）
 * TODO: 上線時改為真實 API endpoint
 */
const MOCK_SITE_DATA = {
  date: '2026-03',
  placeName: '太投成州立體停車場',
  vehicleType: '汽車',
  identityCategories: [
    {
      value: 'resident_car',
      label: '里民汽車',
      areas: [
        {
          value: 'area_1',
          label:
            '第1類：鄰近里民(凌雲路一段149巷 17、19、21、51、61、63、65、67、71',
        },
        {
          value: 'area_2',
          label: '第2類：里民(集賢里、成德里、成功里、成州里)',
        },
      ],
    },
    {
      value: 'general_car',
      label: '一般汽車',
      areas: [{ value: 'area_3', label: '第3類：一般民眾' }],
    },
    {
      value: 'disabled_car',
      label: '身障汽車',
      areas: [
        {
          value: 'area_1',
          label:
            '第1類：鄰近里民(凌雲路一段149巷 17、19、21、51、61、63、65、67、71',
        },
        {
          value: 'area_2',
          label: '第2類：里民(集賢里、成德里、成功里、成州里)',
        },
        { value: 'area_3', label: '第3類：一般民眾' },
      ],
    },
  ],
}

export async function fetchSiteData(/* placeId */) {
  // TODO: return fetch(`/api/place/${placeId}`).then(r => r.json())
  return MOCK_SITE_DATA
}
