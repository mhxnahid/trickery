app.blade.php
```blade
@livewireStyles
@livewireScripts
<script>
    window.types = []
    
    //listening to emmited event
    Livewire.on('typesLoaded', () => {
        
    })

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    //listening to event with data
    Livewire.on('toast', (title, icon = 'success') => {
        Toast.fire({
            icon,
            title
        })
    })
    
    //offline ang online events are kind of useful
    window.addEventListener('offline', () => {
        console.log('offline')
    })
    
    window.addEventListener('online', () => {
        console.log('online')
    })
    
    //hide the BS modal
    Livewire.on('appointmentCreated', () => {
        //console.log('ms')
        $('#createModal').modal('hide');
    });
</script>
<!-- scripts can be pushed to a stack using @push('') in a blade file -->
@stack('lvscripts')
```

Sample Livewire row blade
```blade
<tr class="@if ($invalid) bg-danger-soft @endif @if ($valid) bg-success-soft @endif">
    <td>
        {{ optional($appointment->patient)->name }} 
        <div></div>
        {{ optional($appointment->patient)->phone }}
    </td>
    <td>{{ optional($appointment->healthCenter)->name }}</td>
    <td>{{ optional($appointment->department)->name }}</td>
    <td>{{ $appointment->appoint_at->bn_datetime() }}</td>
    <td>{{ optional($appointment->payment)->id }}</td>
    <td>{{ ucfirst($appointment->assignment_type) }}</td>
    <td>{{ optional($appointment->staff)->name }}</td>
    <td>{{ $appointment->created_at->bn_datetime() }}</td>
    <td>
        <div class="d-flex justify-content-around">
            <!--div>
                <a href="{{ route('staff.appointments.edit', ['appointment' => $appointment->id]) }}" class="btn btn-sm btn-primary">Edit</a>
            </div-->
            <select id="status_{{ $appointment->id }}" wire:model="status" wire:change="changeStatus" class="form-control">
                @foreach ($statuses as $stat)
                    <option value="{{$stat}}">{{ ucfirst($stat) }}</option>
                @endforeach
            </select>
        </div>
    </td>
</tr>
```
Create blade
```
<div>
    <div wire:ignore.self class="modal fade" id="createModal" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ __('Create Appointment') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true close-btn">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    @if($errors->any())
                    @foreach ($errors->all() as $error)
                        <div>{{ $error }}</div>
                    @endforeach
                    @endif
                    <form method="POST">
                        <div class="form-group row">
                            <label for="patient_id"
                                class="col-md-12 col-form-label">@include('partials.required')
                                {{ __('Patient') }}</label>
                                {{ $patient_id }}
                            <div wire:ignore class="col-md-12">
                                <select wire:model="patient_id" name="patient_id" id="patient_id" class="form-control"></select>

                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="department_id"
                                class="col-md-12 col-form-label">@include('partials.required')
                                {{ __('Department') }}</label>
                                {{$department_id}}
                            <div wire:ignore class="col-md-12">
                                <select wire:model="department_id" name="department_id" id="department_id" class="form-control">
                                    @foreach ($departments as $department)
                                    <option value="{{$department->id}}"
                                        {{ old('department_id', isset($appointment) ? $appointment->department_id : '') == $department->id ? 'selected' : '' }}>
                                        {{$department->name}}</option>
                                    @endforeach
                                </select>
                                @include('partials.error_message', ['field' => 'department_id'])
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="status"
                                class="col-md-12 col-form-label">@include('partials.required')
                                {{ __('Appointment Type') }}</label>
                            {{ $status }}
                            <div class="col-md-12">
                                <select wire:model="status" name="status" id="status" class="form-control">
                                    @foreach ($statuses as $status)
                                    <option value="{{$status}}"
                                        {{ old('status', isset($appointment) ? $appointment->status : '') == $status ? 'selected' : '' }}>
                                        {{ ucfirst($status) }}</option>
                                    @endforeach
                                </select>
                                @include('partials.error_message', ['field' => 'status'])
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="appoint_at"
                                class="col-md-12 col-form-label">@include('partials.required')
                                {{ __('Appointment Date') }}</label>
                            {{ $appoint_at }}
                            <div class="col-md-12">
                                <input wire:model="appoint_at" id="appoint_at" type="text"
                                    class="form-control @error('appoint_at') is-invalid @enderror" name="appoint_at"
                                    value="{{ old('appoint_at', isset($patient) ? $patient->appoint_at->sqlFormat(): date('d-m-Y') ) }}"
                                    autocomplete="appoint_at" required>

                                @include('partials.error_message', ['field' => 'appoint_at'])
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="amount"
                                class="col-md-12 col-form-label">@include('partials.required')
                                {{ __('Fees') }}</label>
                            {{ $amount }}
                            <div class="col-md-12">
                                <input wire:model="amount" id="amount" type="number"
                                    class="form-control @error('amount') is-invalid @enderror" name="amount"
                                    value="{{ old('amount', isset($appointment) ? $appointment->amount: '10') }}"
                                    required>

                                @include('partials.error_message', ['field' => 'amount'])
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="payment_method"
                                class="col-md-12 col-form-label">@include('partials.required')
                                {{ __('Payment Method') }}</label>
                            {{ $payment_method }}
                            <div class="col-md-12">
                                <select wire:model="payment_method" name="payment_method" id="payment_method" class="form-control">
                                    @foreach ($payments as $payment_method)
                                    <option value="{{$payment_method}}"
                                        {{ old('payment_method', isset($appointment) ? $appointment->payment_method : '') == $payment_method ? 'selected' : '' }}>
                                        {{ ucfirst($payment_method) }}</option>
                                    @endforeach
                                </select>
                                @include('partials.error_message', ['field' => 'payment_method'])
                            </div>
                        </div>

                        <div class="form-group row">
                            {{ $paid }}
                            <div class="col-md-12">
                                <div class="form-check">
                                    <input wire:model="paid" type="checkbox" name="paid" id="paid" @if (old('paid', isset($appointment) &&
                                        $appointment->paid)) checked @endif class="form-check-input">
                                    <label for="paid" class="form-check-label">Paid</label>
                                    @include('partials.error_message', ['field' => 'paid'])
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" wire:click.prevent="store" class="btn btn-primary close-modal mr-auto">Save
                        changes</button>
                </div>
            </div>
        </div>
    </div>

    <div class="card-header">
        <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#createModal">
            {{ __('Create New Appointment') }} </a>
    </div>

</div>

@push('lvscripts')
    <script>
        var date = document.getElementById('appoint_at');
        
        function checkValue(str, max) {
            if (str.charAt(0) !== '0' || str == '00') {
                var num = parseInt(str);
                if (isNaN(num) || num <= 0 || num > max) num = 1;
                str = num > parseInt(max.toString().charAt(0)) 
                    && num.toString().length == 1 ? '0' + num : num.toString();
            };
            return str;
        };
        
        date.addEventListener('input', function(e) {
            this.type = 'text';
            var input = this.value;
            if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
            var values = input.split('-').map(function(v) {
                return v.replace(/\D/g, '')
            });
            if (values[0]) values[0] = checkValue(values[0], 31);
            if (values[1]) values[1] = checkValue(values[1], 12);
            var output = values.map(function(v, i) {
                return v.length == 2 && i < 2 ? v + '-' : v;
            });
            this.value = output.join('').substr(0, 14);
        });

        $(document).ready(function(){
            $('#department_id').select2({
                theme: "bootstrap",
                //dropdownCssClass: ':all:',
            });
            $('#department_id').on('change', function (e) {
                var data = $('#department_id').select2("val");
                @this.set('department_id', data);
            });

            $('#patient_id').select2({
                placeholder: 'Type phone number',
                allowClear: true,
                theme: "bootstrap",
                ajax: {
                    url: '{{ route('search.appointments.patients') }}',
                    dataType: 'json',
                    delay: 250,
                    data: function (data) {
                        return {
                            phone: data.term // search term
                        };
                    },
                    processResults: function (response) {
                        return {
                            results:  $.map(response, function (item) {
                                return {
                                    text: item.phone+" - "+item.name,
                                    id: item.id
                                }
                            })
                        };
                    },
                    cache: true
                }
            });
            $('#patient_id').on('change', function (e) {
                var data = $('#patient_id').select2("val");
                @this.set('patient_id', data);
            });

            Livewire.on('appointmentCreated', () => 
            {
                $('#createModal').modal('hide');
                $("#patient_id").val('').trigger('change')
            });
        });
    </script>
@endpush
```

Create Class
```php
class AppointmentCreateComponent extends Component
{
    public $payments;
    public $statuses;
    public $departments;
    
    public $department_id;
    public $patient_id;
    public $status;
    public $payment_method;
    public $amount;
    public $appoint_at;
    public $paid;

    public $staff;
    public $health_center;

    protected function storeRules()
    {
        return [
            'patient_id'            => ['required', Rule::exists('patients', 'id')->where('active', 1)->where('banned', 0)],
            'department_id'         => ['required', Rule::exists('department_health_center', 'department_id')->where('health_center_id', $this->health_center->id)],
            'amount'                => 'required|numeric',
            'status'                => ['required', Rule::in(Appointment::STATUSES)],
            'payment_method'        => ['required', Rule::in(Payment::GATEWAYS)],
            'appoint_at'            => 'required|date',
        ];
    }

    
    public function mount($payments, $statuses, $departments)
    {
        $this->payments = $payments;
        $this->statuses = $statuses;
        $this->departments = $departments;

        $this->staff = Auth::user()->staff()->first(['id', 'health_center_id']);
        $this->health_center = $this->staff->healthCenter()->first(['id']);

        $this->dataset();
    }
    
    public function dataset()
    {
        $this->department_id = $this->departments->first()->id;
        $this->patient_id = '';
        $this->status = $this->statuses[0];
        $this->payment_method = $this->payments[0];
        $this->amount = 10;
        $this->appoint_at = date('d-m-Y');
        $this->paid = 1;
    }

    public function store()
    {
        $this->validate($this->storeRules());

        try{
            DB::beginTransaction();

            $appointment = Appointment::query()->create([
                'patient_id'            => $this->patient_id,
                'department_id'         => $this->department_id,
                'health_center_id'      => $this->health_center->id,
                'staff_id'              => $this->staff->id,
                'appoint_at'            => $this->appoint_at,
                //'amount'                => $this->amount,
                'paid'                  => $this->paid,
                'status'                => $this->status,
                'initial_assignment_type'   => Appointment::TYPE_SPOT,
                'assignment_type'       => Appointment::TYPE_SPOT,
            ]);
    
            if($this->paid){
                Payment::create([
                    'appointment_id'    => $appointment->id,
                    'staff_id'  => $this->staff->id,
                    'amount'    => currency_to_lower_denom($this->amount),
                    'payment_status'    => Payment::PAYMENT_PAID,
                    'payment_gateway'    => Payment::GATEWAY_CASH,
                ]);
            }

            DB::commit();
        }catch (Exception $e) {
            DB::rollBack();
        }

        //$this->reset(['patient_id', 'department_id']);
        $this->dataset();

        $this->emit('appointmentCreated');
    }

    public function render()
    {
        return view('livewire.staff.appointments.create');
    }
}
```

Row Class
```php
class AppointmentRowComponent extends Component
{
    public $appointment;
    public $statuses;
    public $status;
    public $invalid;
    public $valid;
    
    public function mount($appointment, $statuses)
    {
        $this->appointment = $appointment;   
        $this->statuses = $statuses;
        $this->status = $appointment->status;
        $this->isInvalid();
    }

    public function changeStatus()
    {
        abort_unless(in_array($this->status, Appointment::STATUSES), 422, __('Invalid status'));
        abort_unless(Gate::allows('changeStatus', $this->appointment), 403, __('Not your appointment'));

        (new AppointmentService)->changeStatus($this->status, $this->appointment);
        $this->isInvalid();

        $this->emit('toast', "Status has been updated");
    }

    private function isInvalid()
    {
        $this->invalid = in_array($this->status, [Appointment::STATUS_ABSENT, Appointment::STATUS_CANCELED]);
        $this->valid = in_array($this->status, [Appointment::STATUS_DONE]);
    }

    public function render()
    {
        return view('livewire.staff.appointments.row');
    }
}
```


