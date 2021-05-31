#### Config for SUB
`config/database.php`
```php
'redis' => [

        ...

        'default' => [
            //'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        'subscribe' => [
            //'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
            'read_timeout' => 60 * 60 * 24 * 30 * 12, //phpredis
            'read_write_timeout' => 0, // predis
        ],

        ...

    ],
```
In my ubuntu 20.04 machine phpredis sub timeout can't be set to 0, but 60 * 60 * 24 * 30 * 12 (an year) is fine!\
TIP: Use predis library, phpredis pecl extension lacks debugging (or I have not turned on exceptions)

#### pubsub quirks
When the subscription callback and the job dispatch uses the same redis connection, it throws an error with predis (phpredis fails silently).
```php
ERR only (P)SUBSCRIBE / (P)UNSUBSCRIBE / PING / QUIT allowed in this context

  at vendor/predis/predis/src/Client.php:370
    366▕             return $response;
    367▕         }
    368▕ 
    369▕         if ($this->options->exceptions) {
  ➜ 370▕             throw new ServerException($response->getMessage());
    371▕         }
    372▕ 
    373▕         return $response;
    374▕     }

      +13 vendor frames 
  14  routes/console.php:28
      dispatch()

      +5 vendor frames 
  20  routes/console.php:29
      Illuminate\Support\Facades\Facade::__callStatic()
```

Solution: Use a different connection (job is using 'default').
```php
Redis::connection('subscribe')->subscribe(['gcs_twilio'], function($message){
      $transcript = json_decode($message);
      dispatch(new ProcessTranscriptJob($transcript));
  });
```
