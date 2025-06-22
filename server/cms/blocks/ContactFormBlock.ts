import { Block } from 'payload/types';

export const ContactFormBlock: Block = {
  slug: 'contact-form',
  labels: {
    singular: 'Formulário de Contato',
    plural: 'Formulários de Contato',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
      localized: true,
    },
    {
      name: 'fields',
      type: 'group',
      label: 'Campos do Formulário',
      fields: [
        {
          name: 'nameField',
          type: 'group',
          label: 'Campo de Nome',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Habilitado',
              defaultValue: true,
            },
            {
              name: 'required',
              type: 'checkbox',
              label: 'Obrigatório',
              defaultValue: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Rótulo',
              defaultValue: 'Nome',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'emailField',
          type: 'group',
          label: 'Campo de Email',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Habilitado',
              defaultValue: true,
            },
            {
              name: 'required',
              type: 'checkbox',
              label: 'Obrigatório',
              defaultValue: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Rótulo',
              defaultValue: 'Email',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'phoneField',
          type: 'group',
          label: 'Campo de Telefone',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Habilitado',
              defaultValue: true,
            },
            {
              name: 'required',
              type: 'checkbox',
              label: 'Obrigatório',
              defaultValue: false,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Rótulo',
              defaultValue: 'Telefone',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'subjectField',
          type: 'group',
          label: 'Campo de Assunto',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Habilitado',
              defaultValue: true,
            },
            {
              name: 'required',
              type: 'checkbox',
              label: 'Obrigatório',
              defaultValue: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Rótulo',
              defaultValue: 'Assunto',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'options',
              type: 'array',
              label: 'Opções',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Rótulo',
                  localized: true,
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  label: 'Valor',
                  required: true,
                },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'messageField',
          type: 'group',
          label: 'Campo de Mensagem',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Habilitado',
              defaultValue: true,
            },
            {
              name: 'required',
              type: 'checkbox',
              label: 'Obrigatório',
              defaultValue: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Rótulo',
              defaultValue: 'Mensagem',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder',
              localized: true,
              admin: {
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'submitButton',
      type: 'group',
      label: 'Botão de Envio',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Texto',
          defaultValue: 'Enviar',
          localized: true,
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Estilo',
          options: [
            { label: 'Primário', value: 'primary' },
            { label: 'Secundário', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
          defaultValue: 'primary',
        },
      ],
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Mensagem de Sucesso',
      defaultValue: 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!',
      localized: true,
      required: true,
    },
    {
      name: 'errorMessage',
      type: 'textarea',
      label: 'Mensagem de Erro',
      defaultValue: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.',
      localized: true,
      required: true,
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Configurações',
      fields: [
        {
          name: 'layout',
          type: 'select',
          label: 'Layout',
          options: [
            { label: 'Padrão', value: 'default' },
            { label: 'Com Imagem à Esquerda', value: 'image-left' },
            { label: 'Com Imagem à Direita', value: 'image-right' },
            { label: 'Com Imagem de Fundo', value: 'image-background' },
          ],
          defaultValue: 'default',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Imagem',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.layout !== 'default',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Cor de Fundo',
          options: [
            { label: 'Branco', value: 'white' },
            { label: 'Cinza Claro', value: 'light' },
            { label: 'Primária', value: 'primary' },
            { label: 'Secundária', value: 'secondary' },
          ],
          defaultValue: 'white',
        },
        {
          name: 'recipients',
          type: 'array',
          label: 'Destinatários',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'Email',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Nome',
            },
          ],
          admin: {
            description: 'Emails que receberão as mensagens enviadas pelo formulário',
          },
        },
        {
          name: 'recaptcha',
          type: 'checkbox',
          label: 'Usar reCAPTCHA',
          defaultValue: true,
        },
      ],
    },
  ],
};

export default ContactFormBlock; 