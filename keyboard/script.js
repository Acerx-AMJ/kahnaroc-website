document.addEventListener("DOMContentLoaded", () =>
{
   // Global

   let repeat_timeouts = [];
   let repeat_intervals = [];

   function stop_repeat(key)
   {
      clearTimeout(repeat_timeouts[key]);
      clearInterval(repeat_intervals[key]);
   }

   let shift_down = false;
   let caps_lock  = false;

   // Generic key implementation

   const input = document.getElementById("search_bar");
   const keys  = document.getElementById("keys");

   function click_button(def, on_shift, is_alpha)
   {
      if (shift_down && caps_lock && is_alpha)
         input.value += on_shift.toUpperCase();
      else
         input.value += (shift_down ? on_shift : def);
   }

   function on_btn_click(key, shift_key, is_alpha)
   {
      click_button(key, shift_key, is_alpha);

      repeat_timeouts[key] = setTimeout(() =>
      {
         repeat_intervals[key] = setInterval(() => click_button(key, shift_key, is_alpha), 50);
      }, 400);
   }

   keys.querySelectorAll('button').forEach(child =>
   {
      if (child.className === 'ignore')
         return;

      const key       = child.innerText[0];
      const shift_key = child.querySelector('.skey').innerText || key;
      const alpha     = child.querySelector('.alpha') !== undefined;

      child.addEventListener("mousedown", () => on_btn_click(key, shift_key, alpha));
      child.addEventListener("touchstart", () => on_btn_click(key, shift_key, alpha));

      child.addEventListener("mouseup", () => stop_repeat(key));
      child.addEventListener("mouseleave", () => stop_repeat(key));
      child.addEventListener("touchend", () => stop_repeat(key));
   });

   // Specific key implementations

   function on_custom_click(name, func)
   {
      func();

      repeat_timeouts[name] = setTimeout(() =>
      {
         repeat_intervals[name] = setInterval(() => func(), 50);
      }, 400);
   }

   function generate_custom_binding(el, func)
   {
      const name = el.innerText;

      el.addEventListener("mousedown", () => on_custom_click(name, func));
      el.addEventListener("touchstart", () => on_custom_click(name, func));

      el.addEventListener("mouseup", () => stop_repeat(name));
      el.addEventListener("mouseleave", () => stop_repeat(name));
      el.addEventListener("touchend", () => stop_repeat(name));
   }

   generate_custom_binding(document.getElementById("del"), () =>
   {
      if (input.value.length !== 0)
         input.value = input.value.substring(0, input.value.length - 1);
   });

   generate_custom_binding(document.getElementById("clear"), () =>
   {
      input.value = "";
   });

   generate_custom_binding(document.getElementById("tab"), () =>
   {
      input.value += '\t';
   });

   generate_custom_binding(document.getElementById("caps"), () =>
   {
      caps_lock = !caps_lock;
      document.getElementById("caps_info").innerText = `Caps Lock: ${caps_lock ? 'On' : 'Off'}`;
   })

   generate_custom_binding(document.getElementById("enter"), () =>
   {
      input.value += '\n';
   });

   generate_custom_binding(document.getElementById("shift"), () =>
   {
      shift_down = !shift_down;
      document.getElementById("shift_info").innerText = `Shift: ${shift_down ? 'On' : 'Off'}`;
   });

   generate_custom_binding(document.getElementById("rshift"), () =>
   {
      shift_down = !shift_down;
      document.getElementById("shift_info").innerText = `Shift: ${shift_down ? 'On' : 'Off'}`;
   });

   generate_custom_binding(document.getElementById("space"), () =>
   {
      input.value += ' ';
   });
});