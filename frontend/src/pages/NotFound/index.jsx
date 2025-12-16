import React from 'react'
import { Col, Row, Image, Container } from '@themesberg/react-bootstrap'
import { useTranslation } from 'react-i18next'
import NotFoundImage from '../../assets/img/illustrations/404.svg'

const NotFound = () => {
  const { t } = useTranslation(['notFound'])
  return (
    <main>
      <section className='vh-100 d-flex align-items-center justify-content-center'>
        <Container>
          <Row>
            <Col
              xs={12}
              className='text-center d-flex align-items-center justify-content-center'
            >
              <div>
                {/* <Card.Link as={Link} to={Routes.DashboardOverview}> */}
                <Image src={NotFoundImage} className='img-fluid w-75' />
                {/* </Card.Link> */}
                <h1 className='text-primary mt-5'>
                  {t('pageNotFound.titleOne')} <span className='fw-bolder'>{t('pageNotFound.titleTwo')}</span>
                </h1>
                <p className='lead my-4'>
                  {t('pageNotFound.description')}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}
export default NotFound