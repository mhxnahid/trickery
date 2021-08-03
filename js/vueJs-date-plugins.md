# three dropdowns (min-max date doesn't work properly)
```vue
<dropdown-datepicker
    :key="dropKey"
    v-bind:on-change="dobChange"
    defaultDateFormat="yyyy-mm-dd"
    :defaultDate="form._dob"
    :maxDate="maxDate"
    :minDate="minDate"
    :daySuffixValues="['', '', '', '']"
    displayFormat="ymd"
    dropdownClass="form-control mr-2"
    wrapperClass="d-flex"
></dropdown-datepicker>
```

```js
<script>
import DropdownDatepicker from "vue-dropdown-datepicker";
import dayjs from "dayjs";

export default {
    components: {
        DropdownDatepicker,
    },
    data() {
        return {
            maxDate: dayjs().format("YYYY-MM-DD"),
            minDate: dayjs("1900-01-01").format("YYYY-MM-DD"),
            dropKey: 9999,

            form: {
                dob: "",
                _dob: "",
            },
        };
    },
    mounted() {
        this.dropKey++
        this.fetchRecords();
    },
    methods: {
        fetchRecords() {
            this.form = {
                ...this.form,
                dob: _patient.dob_bn,
                _dob: dayjs(_patient.dob).format("YYYY-MM-DD"),
            };
            this.dropKey++;
        },
        dobChange(day, month, year) {
            this.form.dob = `${day}-${month}-${year}`;
        },
    },
};
</script>
```
