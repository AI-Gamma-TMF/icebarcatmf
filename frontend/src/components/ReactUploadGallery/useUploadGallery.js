import axios from 'axios'
import { serialize } from 'object-to-formdata'
import { useEffect, useState } from 'react'
import { toast } from '../../components/Toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getGallery } from '../../utils/apiCalls'
import { errorHandler, useDeleteGalleryImage, useUploadGalleryImage } from '../../reactQuery/hooks/customMutationHook'
import useCheckPermission from '../../utils/checkPermission'
import { useTranslation } from 'react-i18next'

const useUploadGallery = () => {
  // const dispatch = useDispatch()
  const { t } = useTranslation(['imageGallery'])
  const { REACT_APP_API_URL } = process.env
  const [initialState, setInitialState] = useState([])
  const [type, setType] = useState('');
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [imageDelete, setImageDelete] = useState()
  const queryClient = useQueryClient()
  const { isHidden } = useCheckPermission()

  const handleCreateEdit = (type, data) => {
    setType(type);
    setData(data);
    setShow(true);
  };


  const { data: gallery } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => getGallery(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.gallery
  })

  const { mutate: uploadGalleryImage, isLoading: loading } =
    useUploadGalleryImage({
      onSuccess: () => {
        toast(t('imageUploadSuccessToast'), 'success')
        queryClient.invalidateQueries({ queryKey: ['gallery'] })
        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });

  const { mutate: deleteImage } = useDeleteGalleryImage({
    onSuccess: () => {
      toast(t('imageDeleteSuccessToast'), 'success')
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    }
  })
  const handleDeleteYes = () => {
    setDeleteModalShow(false)
    const data = { imageUrl: imageDelete?.source }
    deleteImage(data)
    setInitialState([])
  }

  useEffect(() => {
    if (gallery?.length > 0) {
      const state = []
      for (const img in gallery) {
        const data = gallery[img]
        state.push({ name: data.name, source: data.imageUrl })
      }
      setInitialState(state?.reverse())
    }
  }, [gallery?.length])

  const customRequest = ({ uid, file, onProgress, onSuccess, onError }) => {
    if (!isHidden({ module: { key: 'ImageGallery', value: 'U' } })) {
      const action = `${REACT_APP_API_URL}/api/v1/gallery`

      let data = { name: file.name, image: file }
      data = serialize(data)

      const CancelToken = axios.CancelToken
      const source = CancelToken.source()

      axios.post(
        action,
        data,
        {
          headers: {
            'Content-Type': 'multipart/formdata'
          },
          onUploadProgress: ({ total, loaded }) => {
            onProgress(uid, Math.round(loaded / total * 100))
          },
          cancelToken: source.token,
          withCredentials: true
        }
      ).then(({ data: response }) => {
        const state = []
        for (const img in response?.data?.gallery) {
          const data = response?.data?.gallery[img]
          state.push({ name: data.name, source: data.imageUrl })
        }
        onSuccess(uid, state[state?.length - 1])
        setInitialState(state)
        toast(t('imageUploadSuccessToast'), 'success')
      })
        .catch(error => {
          onError(uid, {
            action,
            status: error.request,
            response: error.response
          })
        })
        .catch(error => {
          onError(uid, {
            action,
            status: error.request,
            response: error.response
          })
        })

      return {
        abort() {
          source.cancel()
        }
      }
    } else {
      toast(t('uploadPermissionNotGrantedToast'), 'error')
    }
  }

  return {
    customRequest,
    initialState,
    setInitialState,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    setImageDelete,
    isHidden,
    t,
    type,
    data,
    show,
    handleCreateEdit,
    setShow,
    uploadGalleryImage, 
    gallery,
    loading
  }
}

export default useUploadGallery
