import React from 'react';
import { Pagination, Row, Col, Form } from '@themesberg/react-bootstrap';
import { useTranslation } from 'react-i18next';

const PaginationComponent = ({ page, totalPages, setPage, limit, setLimit }) => {
  const { t } = useTranslation(['translation']);
  const OPTIONS_ARR = [15, 20, 30, 50, 100];
  const items = [];

  if (totalPages > 5) {
    const showFirstPages = page < 3;
    const showLastPages = page > totalPages - 2;

    if (!showFirstPages) {
      items.push(
        <Pagination.Item key={1} active={page === 1} onClick={() => setPage(1)}>
          {1}
        </Pagination.Item>,
      );

      items.push(<Pagination.Ellipsis key='ellipsis1' />);
    } else {
      for (let i = 1; i <= 3; i++) {
        items.push(
          <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
            {i}
          </Pagination.Item>,
        );
      }
    }

    if (showLastPages) {
      for (let i = totalPages - 2; i <= totalPages; i++) {
        items.push(
          <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
            {i}
          </Pagination.Item>,
        );
      }
    }

    if (!showFirstPages && !showLastPages) {
      items.push(
        <Pagination.Item key={page - 1} active={page === page - 1} onClick={() => setPage(page - 1)}>
          {page - 1}
        </Pagination.Item>,
      );

      items.push(
        <Pagination.Item key={page} active onClick={() => setPage(page)}>
          {page}
        </Pagination.Item>,
      );

      items.push(
        <Pagination.Item key={page + 1} active={page === page + 1} onClick={() => setPage(page + 1)}>
          {page + 1}
        </Pagination.Item>,
      );
    }

    if (!showLastPages) {
      items.push(<Pagination.Ellipsis key='ellipsis2' />);

      items.push(
        <Pagination.Item key={totalPages} active={page === totalPages} onClick={() => setPage(totalPages)}>
          {totalPages}
        </Pagination.Item>,
      );
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>,
      );
    }
  }

  return (
    <Row className='mt-3 pagination align-items-center'>
      <Col className='col-lg-5 col-sm-12 col-12'>
        <div className='d-flex justify-content-center justify-content-lg-start align-items-center w-100'>
          <Form.Label style={{ marginBottom: '0', marginRight: '15px' }}>{t('pagination.rowsPerPage')}</Form.Label>

          <Form.Select
            size='sm'
            style={{ maxWidth: '80px' }}
            value={limit}
            onChange={(event) => {
              setLimit(event.target.value);
              setPage(1);
            }}
          >
            {OPTIONS_ARR.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Form.Select>
        </div>
      </Col>

      <Col className='col-lg-7 col-sm-12 col-12 d-flex justify-content-center justify-content-lg-start align-items-center mt-3 mt-lg-0'>
        <Pagination>
          <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
          {items}
          <Pagination.Next disabled={page >= totalPages} onClick={() => setPage(page + 1)} />
        </Pagination>
      </Col>
    </Row>
  );
};

export default PaginationComponent;
