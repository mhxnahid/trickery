### Works fine (Not documented anywhere)

```php
// console.php
Artisan::command('app:install', function(){
    (new SystemService($this))->install();
});
```

```php
// app/Services/SystemService.php
<?php
namespace App\Services;

use Illuminate\Console\Command;

class SystemService
{
    private $makedir;
    private $context;

    /** @param $context console-instance */
    public function __construct(Command $context)
    {
        $this->context = $context;
    }

    public function install()
    {
        $this->context->line("[Installing App]\n");
        $this->context->call("admin:make");
    }

}
```

### Bunch of errors (Found some SOF answers but not really recommended)

You have to extend the `Command` class. That will give you access to `$this->info()` and other methods. \
`protected $this->output` has to be defined as Symfony's ConsoleOutput instance. \n
I could not make it out quite right. Too many errors pop up.
