import type {StructureResolver} from 'sanity/structure'

const languages = [
  {id: 'es', title: 'ES', name: 'Español'},
  {id: 'en', title: 'EN', name: 'English'},
  {id: 'fr', title: 'FR', name: 'Français'},
  {id: 'it', title: 'IT', name: 'Italiano'},
  {id: 'pt', title: 'PT', name: 'Português'},
]

const defaultOrdering = [{field: '_updatedAt', direction: 'desc' as const}]

const filteredList = (
  S: any,
  type: string,
  title: string,
  filter: string,
  params: Record<string, unknown> = {},
) =>
  S.documentTypeList(type)
    .title(title)
    .filter(filter)
    .params(params)
    .defaultOrdering(defaultOrdering)

const filteredItem = (
  S: any,
  title: string,
  type: string,
  filter: string,
  params: Record<string, unknown> = {},
) =>
  S.listItem()
    .title(title)
    .child(filteredList(S, type, title, filter, params))

const languageItems = (S: any, type: string, title: string) =>
  languages.map((language) =>
    filteredItem(
      S,
      `${language.title} ${title}`,
      type,
      '_type == $type && language == $language',
      {
        type,
        language: language.id,
      },
    ),
  )

const postFilter = '_type == "post"'
const authorFilter = '_type == "author"'
const podcastFilter = '_type == "podcast"'

const postListItem = (S: any, title: string, filter: string) =>
  filteredItem(S, title, 'post', `${postFilter} && (${filter})`)

const authorListItem = (S: any, title: string, filter: string) =>
  filteredItem(S, title, 'author', `${authorFilter} && (${filter})`)

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Logia Abierta Studio')
    .items([
      S.listItem()
        .title('Dashboard editorial')
        .child(
          S.list()
            .title('Dashboard editorial')
            .items([
              postListItem(S, 'Borradores', '_id in path("drafts.**")'),
              postListItem(
                S,
                'Publicados',
                '!(_id in path("drafts.**")) && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())',
              ),
              postListItem(
                S,
                'Programados',
                'defined(publishedAt) && dateTime(publishedAt) > dateTime(now())',
              ),
              postListItem(
                S,
                'Pendientes de SEO',
                '!defined(seoTitle) || seoTitle == "" || !defined(seoDescription) || seoDescription == ""',
              ),
              postListItem(
                S,
                'Pendientes de imagen / alt',
                '!defined(mainImage.asset) || !defined(thumbnail.asset) || !defined(mainImage.alt) || !defined(thumbnail.alt)',
              ),
              postListItem(
                S,
                'Traducciones planeadas',
                'defined(targetLanguages[0]) && count(targetLanguages) > 1',
              ),
              authorListItem(
                S,
                'Autores incompletos',
                '!defined(image.asset) || !defined(activeLanguages[0]) || !defined(shortBio[0])',
              ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Artículos')
        .child(
          S.list()
            .title('Artículos')
            .items([
              S.documentTypeListItem('post').title('Todos los artículos'),
              postListItem(S, 'Borradores', '_id in path("drafts.**")'),
              postListItem(
                S,
                'Publicados',
                '!(_id in path("drafts.**")) && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())',
              ),
              postListItem(
                S,
                'Programados',
                'defined(publishedAt) && dateTime(publishedAt) > dateTime(now())',
              ),
              postListItem(
                S,
                'Sin autor',
                '!defined(author._ref)',
              ),
              postListItem(
                S,
                'Sin categorías',
                '!defined(categories[0])',
              ),
              postListItem(S, 'Con FAQ', 'defined(faqs[0])'),
              S.divider(),
              ...languageItems(S, 'post', 'Artículos'),
            ]),
        ),

      S.listItem()
        .title('Traducciones')
        .child(
          S.list()
            .title('Traducciones')
            .items([
              postListItem(
                S,
                'Con idiomas planeados',
                'defined(targetLanguages[0]) && count(targetLanguages) > 1',
              ),
              ...languages.map((language) =>
                postListItem(
                  S,
                  `Planeados para ${language.title}`,
                  `"${language.id}" in targetLanguages`,
                ),
              ),
              S.divider(),
              ...languageItems(S, 'post', 'Artículos por idioma'),
            ]),
        ),

      S.listItem()
        .title('SEO & Social')
        .child(
          S.list()
            .title('SEO & Social')
            .items([
              postListItem(
                S,
                'Falta SEO title',
                '!defined(seoTitle) || seoTitle == ""',
              ),
              postListItem(
                S,
                'Falta SEO description',
                '!defined(seoDescription) || seoDescription == ""',
              ),
              postListItem(
                S,
                'SEO demasiado largo',
                'length(seoTitle) > 60 || length(seoDescription) > 160',
              ),
              postListItem(
                S,
                'Sin social image',
                '!defined(socialImage.asset)',
              ),
              postListItem(
                S,
                'Sin social image alt',
                'defined(socialImage.asset) && (!defined(socialImage.alt) || socialImage.alt == "")',
              ),
              postListItem(
                S,
                'Noindex activo',
                'noindex == true',
              ),
              postListItem(
                S,
                'Canonical override',
                'defined(canonicalUrl) && canonicalUrl != ""',
              ),
              postListItem(
                S,
                'FAQ schema activo',
                'enableFaqSchema == true && defined(faqs[0])',
              ),
            ]),
        ),

      S.listItem()
        .title('Autores')
        .child(
          S.list()
            .title('Autores')
            .items([
              S.documentTypeListItem('author').title('Todos los autores'),
              authorListItem(S, 'Autor default', 'isDefaultAuthor == true'),
              authorListItem(S, 'Sin foto', '!defined(image.asset)'),
              authorListItem(S, 'Sin idiomas activos', '!defined(activeLanguages[0])'),
              authorListItem(S, 'Sin bio corta', '!defined(shortBio[0])'),
              authorListItem(
                S,
                'Perfil masónico visible',
                'showMasonicProfile == true',
              ),
              authorListItem(
                S,
                'Perfil masónico oculto',
                'showMasonicProfile == false',
              ),
              authorListItem(
                S,
                'Con distinciones / cuerpos',
                'defined(primaryRites[0]) || defined(craftBodies[0]) || defined(philosophicalBodies[0]) || defined(appendantBodies[0]) || defined(honors[0])',
              ),
            ]),
        ),

      S.listItem()
        .title('Contenido avanzado')
        .child(
          S.list()
            .title('Contenido avanzado')
            .items([
              postListItem(S, 'Con Mermaid', 'count(body[_type == "mermaidChart"]) > 0'),
              postListItem(S, 'Con Impress', 'count(body[_type == "impressDeck"]) > 0'),
              postListItem(S, 'Con code blocks', 'count(body[_type == "codeBlock"]) > 0'),
              postListItem(S, 'Con Raw MDX', 'count(body[_type == "rawMdx"]) > 0'),
            ]),
        ),

      S.listItem()
        .title('Podcasts')
        .child(
          S.list()
            .title('Podcasts')
            .items([
              S.documentTypeListItem('podcast').title('Todos los podcasts'),
              filteredItem(
                S,
                'Borradores',
                'podcast',
                `${podcastFilter} && _id in path("drafts.**")`,
              ),
              S.divider(),
              ...languageItems(S, 'podcast', 'Podcasts'),
            ]),
        ),

      S.documentTypeListItem('category').title('Categorías'),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['post', 'podcast', 'author', 'category'].includes(listItem.getId()!),
      ),
    ])
