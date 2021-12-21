function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function upload(selector, options = {}) {
  let files = []
  const input = document.querySelector(selector);
  const preview = document.createElement('div')

  preview.classList.add('preview')

  const open = document.createElement('button')
  open.classList.add('btn')
  open.textContent = 'Open'

  if (options.multi) {
    input.setAttribute('multiple', true)
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(', '))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', open)

  const triggerInput = () => input.click()

  const changeHandler = event => {
    if (!event.target.files.length) {
      return
    }

    const files = Array.from(event.target.files)

    preview.innerHTML = ''
    files.forEach(file => {
      if (!file.type.match('image')) {
        return
      }

      const reader = new FileReader()

      reader.onload = ev => {
        const src = ev.target.result
        // /*html*/ caption is for html syntax highlight in js 
        preview.insertAdjacentHTML('afterbegin', /*html*/`
        <div class="preview-image">
          <div class="preview-remove" data-name="${file.name}">&times;</div>
          <img src="${src}" alt="${file.name}" />
          <div class="preview-info">
            <span>${file.name}</span>
            ${bytesToSize(file.size)}
          </div>
        </div>
        `)
      }

      reader.readAsDataURL(file)
    })
  }

  const removeHandler = event => {
    if (!event.target.dataset.name) {
      return
    }

    const { name } = event.target.dataset
    files = files.filter(file => file.name !== name)

    const block = preview
    .querySelector(`[data-name="${name}"]`)
    .closest('.preview-image')
    
    block.classList.add('removing')
    setTimeout(() => block.remove(), 300);
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
}