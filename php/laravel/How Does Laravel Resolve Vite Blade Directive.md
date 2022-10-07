```php
#vendor/laravel/framework/src/Illuminate/View/Compilers/Concerns/CompilesHelpers.php:58
  use Illuminate\Foundation\Vite;
  
    /**
     * Compile the "vite" statements into valid PHP.
     *
     * @param  ?string  $arguments
     * @return string
     */
    protected function compileVite($arguments)
    {
        $arguments ??= '()';

        $class = Vite::class;

        return "<?php echo app('$class'){$arguments}; ?>";
    }
```
