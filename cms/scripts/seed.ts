import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-08-12'})

const image = (assetId: string, alt: string) => ({
  _type: 'image',
  asset: {
    _type: 'reference',
    _ref: assetId,
  },
  alt,
})

const body = (text: string, key: string) => [
  {
    _type: 'block',
    _key: `${key}-block`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `${key}-span`,
        marks: [],
        text,
      },
    ],
  },
]

async function uploadPlaceholder(
  filename: string,
  title: string,
  subtitle: string,
  width = 1200,
  height = 700,
) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#171717"/>
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}"
      fill="none" stroke="#c8a96b" stroke-width="3"/>
    <text
      x="50%" y="47%"
      text-anchor="middle"
      fill="#c8a96b"
      font-family="serif"
      font-size="64"
    >${title}</text>
    <text
      x="50%" y="57%"
      text-anchor="middle"
      fill="#ffffff"
      font-family="sans-serif"
      font-size="28"
    >${subtitle}</text>
  </svg>
  `

  return client.assets.upload(
    'image',
    Buffer.from(svg),
    {filename},
  )
}

async function run() {
  console.log('')
  console.log('🌱 Logia Abierta — creando demo content')
  console.log('Project:', client.config().projectId)
  console.log('Dataset:', client.config().dataset)
  console.log('')

  console.log('Subiendo imágenes demo...')

  const heroAsset = await uploadPlaceholder(
    'logia-abierta-hero.svg',
    'LOGIA ABIERTA',
    'Historia · Simbolismo · Filosofía',
  )

  const articleAsset = await uploadPlaceholder(
    'logia-abierta-article.svg',
    'LOGIA ABIERTA',
    'Archivo Masónico',
  )

  const authorAsset = await uploadPlaceholder(
    'logia-abierta-author.svg',
    'LA',
    'Autor',
    800,
    800,
  )

  const podcastAsset = await uploadPlaceholder(
    'logia-abierta-podcast.svg',
    'LOGIA ABIERTA',
    'Podcast',
  )

  console.log('Creando categorías...')

  const categories = [
    ['seed-category-historia', 'Historia', 'historia'],
    ['seed-category-simbolismo', 'Simbolismo', 'simbolismo'],
    ['seed-category-filosofia', 'Filosofía', 'filosofia'],
    ['seed-category-ritos', 'Ritos', 'ritos'],
    ['seed-category-cultura', 'Cultura Masónica', 'cultura-masonica'],
  ]

  for (const [id, title, slug] of categories) {
    await client.createOrReplace({
      _id: id,
      _type: 'category',

      title: [
        {
          _key: `${id}-es`,
          _type: 'internationalizedArrayStringValue',
          language: 'es',
          value: title,
        },
      ],

      slug: {
        _type: 'slug',
        current: slug,
      },
    })
  }

  console.log('Creando autores...')

  const authors = [
    {
      id: 'seed-author-redaccion',
      name: 'Redacción Logia Abierta',
      slug: 'redaccion-logia-abierta',
      job: 'Equipo editorial',
      city: 'Santo Domingo',
      description:
        'Equipo editorial dedicado a la historia, simbolismo, filosofía y cultura de la tradición masónica.',
    },
    {
      id: 'seed-author-editor',
      name: 'Editor Invitado',
      slug: 'editor-invitado',
      job: 'Investigador',
      city: 'Santo Domingo',
      description:
        'Perfil temporal utilizado para desarrollar y probar la experiencia editorial de Logia Abierta.',
    },
    {
      id: 'seed-author-archivo',
      name: 'Archivo Logia Abierta',
      slug: 'archivo-logia-abierta',
      job: 'Documentación histórica',
      city: 'Santo Domingo',
      description:
        'Perfil editorial para piezas documentales, fuentes históricas y material de archivo.',
    },
  ]

  for (const author of authors) {
    await client.createOrReplace({
      _id: author.id,
      _type: 'author',
      language: 'es',
      name: author.name,

      slug: {
        _type: 'slug',
        current: author.slug,
      },

      job: author.job,
      city: author.city,
      description: author.description,

      image: image(
        authorAsset._id,
        author.name,
      ),

      bio: body(
        'Perfil de demostración utilizado durante el desarrollo de Logia Abierta. Será reemplazado por información editorial definitiva.',
        author.id,
      ),
    })
  }

  console.log('Creando artículos...')

  const posts = [
    {
      id: 'seed-post-templo',
      title: 'El Templo como representación del universo',
      slug: 'el-templo-como-representacion-del-universo',
      category: 'seed-category-simbolismo',
      author: 'seed-author-redaccion',
      duration: 8,
      description:
        'Una introducción al templo masónico como espacio simbólico y representación ordenada del universo.',
    },
    {
      id: 'seed-post-luz',
      title: 'El simbolismo de la Luz',
      slug: 'el-simbolismo-de-la-luz',
      category: 'seed-category-simbolismo',
      author: 'seed-author-redaccion',
      duration: 6,
      description:
        'Una aproximación al significado de la Luz como imagen del conocimiento, la conciencia y la búsqueda iniciática.',
    },
    {
      id: 'seed-post-piedra',
      title: '¿Qué significa trabajar la Piedra Bruta?',
      slug: 'que-significa-trabajar-la-piedra-bruta',
      category: 'seed-category-filosofia',
      author: 'seed-author-editor',
      duration: 7,
      description:
        'El trabajo interior expresado mediante uno de los símbolos más conocidos de la tradición masónica.',
    },
    {
      id: 'seed-post-especulativa',
      title: 'Los orígenes de la Masonería especulativa',
      slug: 'origenes-de-la-masoneria-especulativa',
      category: 'seed-category-historia',
      author: 'seed-author-archivo',
      duration: 10,
      description:
        'Una mirada introductoria a la transición histórica entre la tradición operativa y la masonería especulativa.',
    },
    {
      id: 'seed-post-compas',
      title: 'Escuadra y Compás: símbolo y construcción',
      slug: 'escuadra-y-compas-simbolo-y-construccion',
      category: 'seed-category-simbolismo',
      author: 'seed-author-redaccion',
      duration: 5,
      description:
        'Geometría, conducta y construcción interior alrededor de dos herramientas convertidas en símbolos.',
    },
    {
      id: 'seed-post-memphis',
      title: 'El Rito de Memphis y su desarrollo histórico',
      slug: 'rito-de-memphis-desarrollo-historico',
      category: 'seed-category-ritos',
      author: 'seed-author-archivo',
      duration: 12,
      description:
        'Una pieza de demostración sobre el desarrollo histórico y las características generales del Rito de Memphis.',
    },
    {
      id: 'seed-post-camara',
      title: 'La Cámara de Reflexiones',
      slug: 'la-camara-de-reflexiones',
      category: 'seed-category-cultura',
      author: 'seed-author-editor',
      duration: 7,
      description:
        'Una introducción al espacio de reflexión previa y a algunos de los símbolos que tradicionalmente lo acompañan.',
    },
    {
      id: 'seed-post-real-arco',
      title: 'Historia y simbolismo del Real Arco',
      slug: 'historia-y-simbolismo-del-real-arco',
      category: 'seed-category-historia',
      author: 'seed-author-redaccion',
      duration: 11,
      description:
        'Una introducción histórica y simbólica al Real Arco dentro del amplio panorama de la tradición masónica.',
    },
  ]

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]

    await client.createOrReplace({
      _id: post.id,
      _type: 'post',
      language: 'es',

      title: post.title,

      slug: {
        _type: 'slug',
        current: post.slug,
      },

      description: post.description,

      author: {
        _type: 'reference',
        _ref: post.author,
      },

      duration: post.duration,

      mainImage: image(
        i === 0 ? heroAsset._id : articleAsset._id,
        post.title,
      ),

      thumbnail: image(
        articleAsset._id,
        post.title,
      ),

      categories: [
        {
          _key: `${post.id}-category`,
          _type: 'reference',
          _ref: post.category,
        },
      ],

      publishedAt: new Date(
        Date.UTC(2026, 7, 5 + i, 12, 0, 0),
      ).toISOString(),

      body: body(
        `Este es contenido temporal de demostración para mantener visible el diseño de Logia Abierta mientras se desarrolla la plataforma editorial. El artículo definitivo sustituirá este texto.`,
        post.id,
      ),
    })
  }

  console.log('Creando podcasts...')

  const podcasts = [
    {
      id: 'seed-podcast-1',
      title: 'Introducción a Logia Abierta',
      slug: 'introduccion-a-logia-abierta',
      episode: 1,
      duration: 18,
    },
    {
      id: 'seed-podcast-2',
      title: 'Símbolos, tradición y construcción interior',
      slug: 'simbolos-tradicion-construccion-interior',
      episode: 2,
      duration: 27,
    },
    {
      id: 'seed-podcast-3',
      title: 'Historia de los Ritos',
      slug: 'historia-de-los-ritos',
      episode: 3,
      duration: 34,
    },
  ]

  for (const podcast of podcasts) {
    await client.createOrReplace({
      _id: podcast.id,
      _type: 'podcast',
      language: 'es',

      title: podcast.title,

      slug: {
        _type: 'slug',
        current: podcast.slug,
      },

      description:
        'Episodio temporal utilizado para desarrollar la sección de audio de Logia Abierta.',

      duration: podcast.duration,
      episod: podcast.episode,

      mainImage: image(
        podcastAsset._id,
        podcast.title,
      ),

      publishedAt: new Date(
        Date.UTC(2026, 7, 9 + podcast.episode, 12, 0, 0),
      ).toISOString(),

      body: body(
        'Contenido temporal para probar el diseño de podcasts. Más adelante esta sección enlazará con Substack, Spotify y las series de Logia Abierta.',
        podcast.id,
      ),
    })
  }

  console.log('')
  console.log('✅ Seed completado')
  console.log('   5 categorías')
  console.log('   3 autores')
  console.log('   8 artículos')
  console.log('   3 podcasts')
  console.log('')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
