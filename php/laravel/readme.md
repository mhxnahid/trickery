## How-do

## Quirks

##### `$this->middleware('name')` has to be used within `__construct()` in a controller. It doesn't work in a controller method. Use `Gate::authorize()` or `$this->authorize()`

## Eloquent/Sql

##### Empty timestamps array in eloquent results in 00-00-00 in timestamp fields (created_at, updated_at)

```php
public $timestamps = [];
```

##### Eloquent ->create() or ::create() only returns fields that were provided in the input array, along with timestamps
```php
$item = Item::create($data); // some fields
$item = $item->fresh(); // retrieve full record from DB
```

##### Eloquent static boot() used with boot[TraitName] convention crashes the CLI server (7.4)
Using multiple boot() within the model and in a trait overrrides the one in the trait.
Using Oberserver seems to be better. Event/Listeners can be used as well but that's too much work for simply sending an email upon Model creation.
```php
protected static function boot(){
    //
}

//AppServiceProvider.php
public function boot()
    {
        User::observe(UserObserver::class);
    }
```

##### insert() doesn't check for types, won't fill in timestamps

#### [Eager loading sum of a column from relationship](https://stackoverflow.com/a/50417277/2923388)
```php
$pumps = Pump::whereIn('unite_id', $unites)
                    ->withCount(['sessions' => function($query){
                        $query->select( DB::raw( "COALESCE(SUM(payable),0)" ) );
                      },
                      'payments' => function($query){
                        $query->select( DB::raw( "COALESCE(SUM(amount),0)" ) );
                      }
                     ])
                    ->get();
```
Available in loop with `->sessions_count` and `->payments_count` . Use alias in `withCount` if multiple counts/sums are required from the same relation.

