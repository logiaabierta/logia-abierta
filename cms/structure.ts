import type {StructureResolver} from 'sanity/structure'

const languages = [
  {id: 'es', title: 'ES'},
  {id: 'en', title: 'EN'},
  {id: 'fr', title: 'FR'},
  {id: 'it', title: 'IT'},
  {id: 'pt', title: 'PT'},
]

const languageSection = (
  S: any,
  type: string,
  title: string,
) =>
  S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items(
          languages.map((language) =>
            S.listItem()
              .title(language.title)
              .child(
                S.documentTypeList(type)
                  .title(`${language.title} ${title}`)
                  .filter('_type == $type && language == $language')
                  .params({
                    type,
                    language: language.id,
                  }),
              ),
          ),
        ),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      languageSection(S, 'post', 'Artículos'),
      languageSection(S, 'podcast', 'Podcasts'),
      languageSection(S, 'author', 'Autores'),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['post', 'podcast', 'author'].includes(listItem.getId()!),
      ),
    ])
