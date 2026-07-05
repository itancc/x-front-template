import { defineComponent, ref, computed } from 'vue'
import './PageContent.scss'

// --- Types ------------------------------------------------------------------
type Subscription = 'Pro' | 'Plus' | 'Prime'

interface Contact {
  id: number
  name: string
  code: number
  title: string
  email: string
  subscription: Subscription
  phone: string
  paid: boolean
  address: string
}

// --- Static data ------------------------------------------------------------
const FIRST_NAMES = [
  'Zain', 'Kierra', 'Wilson', 'Emerson', 'Alfredo', 'Terry', 'Maria',
  'Tatiana', 'Anika', 'Ryan', 'Marilyn', 'Allison', 'Omar', 'Lindsey',
  'Anika', 'Skylar', 'Gustavo', 'Abram', 'Carter', 'Jocelyn',
  'Aspen', 'Craig', 'Alfonso', 'Jaylon', 'Carla', 'Justin',
  'Leo Rhiel', 'Ahmad', 'Danny',
]

const LAST_NAMES = [
  'Lubin', 'Westervelt', 'Curtis', 'Dokidis', 'Westervelt', 'Bator', 'Geidt',
  'Bergson', 'Bergson', 'Torff', 'Schleifer', 'Mango', 'Carder', 'Schleifer',
  'Gouse', 'Bergson', 'Rosser', 'Botosh', 'Lipshutz', 'George',
  'Baptista', 'Dias', 'Levin', 'Press', 'Philips', 'George',
  'Madsen', 'Stanton', 'Westervelt',
]

const TITLES = [
  'Manager', 'Director', 'Assistant', 'VP of Sales', 'Engineer',
  'HR Manager', 'CEO', 'CFO', 'Product Manager', 'Marketing Director',
  'IT Specialist', 'Customer Support', 'Developer', 'Analyst', 'Designer',
  'UX Specialist', 'Sales Manager', 'Operations Manager', 'Accountant', 'Legal Advisor',
  'Consultant', 'HR Specialist', 'Financial Analyst', 'Marketing Specialist', 'Sales Associate',
  'Product Specialist', 'IT Manager', 'Customer Service Rep', 'Quality Analyst',
]

const EMAILS = [
  'zlubin@gmail.com', 'kierraw@outlook.com', 'wilcurtis@outlook.com',
  'emerson12@gmail.com', 'alfredo.pasta@gmail.com', 'terryb@gmail.com',
  'Maria@gmail.com', 'Tatiana@outlook.com', 'abergson34@outlook.com',
  'ryan@outlook.com', 'marschleifer@gmail.com', 'allmango@outlook.com',
  'cardomar@gmail.com', 'lindor.schleifer167@gmail.com', 'anikagoose@gmail.com',
  'skylarbr@outlook.com', 'gustavo.frig@gmail.com', 'abram.botosh@gmail.com',
  'carlip@outlook.com', 'joycelyn@outlook.com', 'aspen.baptista@crmco.com',
  'daniel.craig007@gmail.com', 'alfonso.mango@gmail.com', 'jaypress2@gmail.com',
  'captainphilips@outlook.com', 'justingeorg76@gmail.com', 'leo.mad47@gmail.com',
  'ahmadstadnoff@gmail.com', 'wandert@gmail.com',
]

const PHONES = [
  '+8207461130782', '+7047091633321', '+7893981497100', '+3080455855339',
  '+2061017757126', '+2173332610583', '+4310278098225', '+5641767475164',
  '+5780276410651', '+1538466144374', '+2972920609792', '+8150785239446',
  '+2482177130336', '+7303405788284', '+3993821935728', '+5026251794160',
  '+2649495275969', '+4543872829422', '+9375197382726', '+3016481599823',
  '+7743877152391', '+5823216443829', '+7439068631856', '+9879076439096',
  '+2684535343620', '+8716001578881', '+5350647084232', '+12645142048635',
  '+5788352866766',
]

const ADDRESSES = [
  '2400 Route 9, Fishkill NY 12524', '200 Otis Street, Northborough MA',
  '90 Catskill Ave, Windsor NY 12414', '100 Elm Ridge Center Dr, Rochester NY',
  '601 Stottle Blvd, Kingston NY', '700 Oak Street, Brockton MA',
  '100 Throway Plaza, Cheektowaga NY', '72 Main St, North Reading MA',
  '103 North Caroline St, Herkimer NY', '85 Crooked Hill Road, Commack NY',
  '2972 Route 9, Clifton Park NY', '70 Pleasant Valley Street, Methuen MA',
  '121 Worcester Rd, Framingham MA', '506 State Road, North Dartmouth MA',
  '1549 Rt 9, Halfmoon NY 12065', '5360 Southwestern Blvd, Hamburg NY',
  '1000 State Route 36, Hornell NY', '280 Washington Street, Hanover MA',
  '250 Rt 59, Airmont NY 10901', '279 Troy Road, East Greenbush NY',
  '901 Route 110, Farmingdale NY', '2 Gannett Dr, Johnson City NY',
  '25737 US Rt 11, Evans Mills NY', '909 Schenectady-Glens Falls Rd, NY',
  '3018 East Ave, Central Square NY', '36 Paramount Drive, Raynham MA',
  '30 Memorial Road, Avon MA 02322', '4300 Lakeville Road, Geneseo NY',
  '780 Lynnway, Lynn MA 01905',
]

const SUBS: Subscription[] = ['Pro', 'Plus', 'Prime']
const PAID_FLAGS = [
  false, false, true, false, false, true, false, true, true, false,
  false, true, true, false, false, false, true, false, false, true,
  false, false, true, false, false, true, true, false, false,
]

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#06b6d4',
]

function avatarColor(name: string): string {
  const i = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % AVATAR_COLORS.length
  return AVATAR_COLORS[i]
}

function initials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const ALL_CONTACTS: Contact[] = Array.from({ length: 241 }, (_, i) => ({
  id:           i + 1,
  name:         `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
  code:         321 + i,
  title:        TITLES[i % TITLES.length],
  email:        i < EMAILS.length ? EMAILS[i] : `user${i + 1}@example.com`,
  subscription: SUBS[i % SUBS.length],
  phone:        i < PHONES.length ? PHONES[i] : `+${1000000000000 + i * 10007}`,
  paid:         PAID_FLAGS[i % PAID_FLAGS.length],
  address:      i < ADDRESSES.length ? ADDRESSES[i] : `${100 + i} Main St, City NY`,
}))

// --- Component --------------------------------------------------------------
export default defineComponent({
  name: 'PageContent',
  setup() {
    const page     = ref(1)
    const pageSize = ref(50)
    const total    = ALL_CONTACTS.length

    const rows = computed(() => {
      const start = (page.value - 1) * pageSize.value
      return ALL_CONTACTS.slice(start, start + pageSize.value)
    })

    const totalPages = computed(() => Math.ceil(total / pageSize.value))

    const pageNums = computed(() => {
      const tp  = totalPages.value
      const cur = page.value
      const start = Math.max(1, Math.min(cur - 2, tp - 4))
      const end   = Math.min(tp, start + 4)
      const nums: number[] = []
      for (let n = start; n <= end; n++) nums.push(n)
      return nums
    })

    function prevPage() { if (page.value > 1) page.value-- }
    function nextPage() { if (page.value < totalPages.value) page.value++ }
    function goPage(n: number) { page.value = n }

    return () => (
      <div class="crm-page">

        {/* Toolbar */}
        <div class="crm-toolbar">
          <button type="button" class="crm-toolbar__btn">Fields</button>
          <button type="button" class="crm-toolbar__btn">
            Filter <span class="crm-toolbar__badge">2</span>
          </button>
          <button type="button" class="crm-toolbar__btn">Group</button>
          <button type="button" class="crm-toolbar__btn">Sort</button>
          <div class="crm-toolbar__spacer" />
          <button type="button" class="crm-toolbar__icon-btn" title="Add column">+</button>
          <button type="button" class="crm-toolbar__icon-btn" title="Search">S</button>
        </div>

        {/* Table */}
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead class="crm-table__head">
              <tr>
                <th class="crm-table__th is-check">
                  <input type="checkbox" class="crm-table__check" />
                </th>
                <th class="crm-table__th is-num">#</th>
                <th class="crm-table__th" style="min-width:180px">Contact Name</th>
                <th class="crm-table__th" style="width:90px">Cotac...</th>
                <th class="crm-table__th" style="min-width:130px">Title</th>
                <th class="crm-table__th" style="width:90px">Profile Picture</th>
                <th class="crm-table__th" style="min-width:190px">Email</th>
                <th class="crm-table__th" style="width:120px">Subscription</th>
                <th class="crm-table__th" style="min-width:160px">Registration Nu...</th>
                <th class="crm-table__th" style="width:100px">Paid Member</th>
                <th class="crm-table__th" style="min-width:220px">Postal Address</th>
              </tr>
            </thead>
            <tbody>
              {rows.value.map((row, idx) => (
                <tr key={row.id} class="crm-table__row">
                  <td class="crm-table__td is-check">
                    <input type="checkbox" class="crm-table__check" />
                  </td>
                  <td class="crm-table__td is-num">
                    {(page.value - 1) * pageSize.value + idx + 1}.
                  </td>
                  <td class="crm-table__td">
                    <a class="crm-table__link">{row.name}</a>
                  </td>
                  <td class="crm-table__td is-muted">{row.code}</td>
                  <td class="crm-table__td is-muted">{row.title}</td>
                  <td class="crm-table__td">
                    <div
                      class="crm-table__avatar"
                      style={{ background: avatarColor(row.name) }}
                    >
                      {initials(row.name)}
                    </div>
                  </td>
                  <td class="crm-table__td is-muted" style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                    {row.email}
                  </td>
                  <td class="crm-table__td">
                    <span class={['crm-badge', `is-${row.subscription.toLowerCase()}`]}>
                      {row.subscription}
                    </span>
                  </td>
                  <td class="crm-table__td is-muted">{row.phone}</td>
                  <td class="crm-table__td is-check">
                    <input
                      type="checkbox"
                      class="crm-table__check"
                      checked={row.paid}
                      readonly
                    />
                  </td>
                  <td class="crm-table__td is-muted" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                    {row.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div class="crm-pagination">
          <span class="crm-pagination__info">
            {(page.value - 1) * pageSize.value + 1}
            {' - '}
            {Math.min(page.value * pageSize.value, total)}
            {' of '}
            {total}
            {' records'}
          </span>

          <div class="crm-pagination__nav">
            <button
              type="button"
              class="crm-pagination__btn"
              disabled={page.value === 1}
              onClick={prevPage}
            >
              &lt;
            </button>
            {pageNums.value.map((n) => (
              <button
                key={n}
                type="button"
                class={['crm-pagination__btn', page.value === n && 'is-active']}
                onClick={() => goPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              class="crm-pagination__btn"
              disabled={page.value === totalPages.value}
              onClick={nextPage}
            >
              &gt;
            </button>
          </div>

          <div class="crm-pagination__size">
            <span>Records per page</span>
            <select
              class="crm-pagination__select"
              value={pageSize.value}
              onChange={(e) => {
                pageSize.value = Number((e.target as HTMLSelectElement).value)
                page.value = 1
              }}
            >
              {[20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

      </div>
    )
  },
})
