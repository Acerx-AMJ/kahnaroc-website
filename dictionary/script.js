document.addEventListener('DOMContentLoaded', () =>
{
   // Define variables and elements
   const dictionary     = document.getElementById('dictionary');
   const sub_header     = document.getElementById('sub_header');
   const search_bar     = document.getElementById('search_bar');
   const show_favorites = document.getElementById('show_favorites');
   const first_page     = document.getElementById('first_page');
   const prev_page      = document.getElementById('prev_page');
   const page_numbers   = document.getElementById('page_numbers');
   const next_page      = document.getElementById('next_page');
   const last_page      = document.getElementById('last_page');
   
   const page_size  = 60;
   const page_range = (window.matchMedia("(max-width: 600px)").matches ? 1 : 3);

   let current_page     = 1;
   let total_word_count = 0;
   let all_entries      = [];
   let filtered_entries = [];
   let favorites        = JSON.parse(localStorage.getItem('favorites')) || [];
   let only_favorites   = false;

   // Load words from JSON
   fetch('words.json')
      .then(response => response.json())
      .then(data =>
      {
         all_entries = data.map((entry) =>
         ({
            name: entry[0],
            desc: entry[1],
            tags: entry[2]
         })).sort((a, b) => a.name.localeCompare(b.name));

         filtered_entries = [...all_entries];
         total_word_count = filtered_entries.length;
         sub_header.innerText = total_word_count + ' Words, ' + total_word_count + ' Selected';
         show_page();
   });

   // Favorite functions
   function get_favorite_img(favorite)
   {
      return favorite ? '../assets/heart_filled.png' : '../assets/heart.png';
   }

   function toggle_favorite(name, icon_element)
   {
      const index = favorites.indexOf(name);
      const is_now_favorite = index === -1;

      if (is_now_favorite)
         favorites.push(name);
      else
         favorites.splice(index, 1);
      
      icon_element.src = get_favorite_img(is_now_favorite);
      localStorage.setItem('favorites', JSON.stringify(favorites));

      if (only_favorites && !is_now_favorite)
         search_bar.dispatchEvent(new Event('input'));
   }

   // Create new dictionary entry
   function create_entry(entry)
   {
      const favorite = favorites.includes(entry.name);
      const div = document.createElement('div');
      div.className = 'entry';

      div.innerHTML = `
      <span class="word">${entry.name}</span>
      <img class="favorite_icon" src="${get_favorite_img(favorite)}" data-name="${entry.name}">
      <div class="description">${entry.desc}</div>
      <div class="tags">
         ${entry.tags.split(',').map(tag => `<span class="tag ${tag.trim().toLowerCase()}">${tag.trim()}</span>`).join(' ')}
      </div>`;

      const fav_icon = div.querySelector('.favorite_icon');
      fav_icon.addEventListener('click', () => toggle_favorite(entry.name, fav_icon));
      return div;
   }

   // Render all entries in the current page
   function render_page_buttons(total_pages)
   {
      page_numbers.innerHTML = '';

      const start_page = Math.max(1, current_page - page_range);
      const end_page = Math.min(total_pages, current_page + page_range);

      for (let i = start_page; i <= end_page; i++)
      {
         const btn = document.createElement('button');
         btn.textContent = i;
   
         if (i === current_page)
            btn.classList.add('active');

         btn.addEventListener('click', () =>
         {
            current_page = i;
            show_page();
         });
         page_numbers.appendChild(btn);
      }
   }

   // Show the current page
   function show_page()
   {
      total_pages = Math.ceil(filtered_entries.length / page_size);
      if (total_pages == 0)
         ++total_pages;
      
      sub_header.innerText = total_word_count + ' Words, ' + filtered_entries.length + ' Selected';
      dictionary.innerHTML = '';

      if (filtered_entries.length === 0)
      {
         dictionary.innerHTML = '<p style="padding: 1rem; text-align: center;">No results match your filters.</p>';
         prev_page.disabled = next_page.disabled = first_page.disabled = last_page.disabled = true;
         page_numbers.innerHTML = '';
         return;
      }

      const start = (current_page - 1) * page_size;
      const end = start + page_size;
      page_entries = filtered_entries.slice(start, end);

      page_entries.forEach(entry =>
      {
         const el = create_entry(entry);
         dictionary.appendChild(el);
      });

      render_page_buttons(total_pages);
      first_page.disabled = prev_page.disabled = current_page === 1;
      last_page.disabled = next_page.disabled = current_page === total_pages;
   }

   // Update search filters
   search_bar.addEventListener('input', function ()
   {
      const query = search_bar.value.toLowerCase();
      const base_list = only_favorites ? all_entries.filter(entry => favorites.includes(entry.name)) : all_entries;

      filtered_entries = base_list.filter(entry =>
         entry.name.toLowerCase().includes(query) ||
         entry.tags.toLowerCase().includes(query) ||
         entry.desc.toLowerCase().includes(query)
      );

      current_page = 1;
      show_page();
   });

   // Handle the pagination buttons
   prev_page.addEventListener('click', () =>
   {
      if (current_page > 1)
      {
         --current_page;
         show_page();
      }
   });

   next_page.addEventListener('click', () =>
   {
      const max_page = Math.ceil(filtered_entries.length / page_size);
      if (current_page < max_page)
      {
         ++current_page;
         show_page();
      }
   });

   first_page.addEventListener('click', () =>
   {
      current_page = 1;
      show_page();
   })

   last_page.addEventListener('click', () =>
   {
      current_page = Math.ceil(filtered_entries.length / page_size);
      if (current_page === 0)
         ++current_page;
      show_page();
   });

   // Handle the favorites button
   show_favorites.addEventListener('click', () =>
   {
      only_favorites = !only_favorites;
      show_favorites.src = get_favorite_img(only_favorites);
      current_page = 1;
      search_bar.dispatchEvent(new Event('input'));
   });

   show_page();
});
