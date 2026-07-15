import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';

import { Customer, Mechanic, NewJobFormValues } from '../WorkshopTimeline.types';

import { Tooltip } from './Tooltip';

type NewJobDrawerProps = {
  customers: Customer[];
  isOpen: boolean;
  mechanics: Mechanic[];
  onClose: () => void;
  onSubmit: (newJobFormValues: NewJobFormValues) => void;
};

const initialFormValues: NewJobFormValues = {
  customerName: '',
  phoneNumber: '',
  registration: '',
  vehicleDescription: '',
  reason: '',
  mechanicId: 'dave',
  scheduledStart: '13:00',
  scheduledEnd: '14:00',
  status: 'Booked',
  callbackRequired: false,
  callbackDueTime: '15:00',
};

const normalizeRegistrationSearch = (value: string) => value.replace(/\s/g, '').toLowerCase();

const customerMatchesSearch = (customer: Customer, searchValue: string) => {
  const normalizedSearch = searchValue.trim().toLowerCase();
  const registrationSearch = normalizeRegistrationSearch(searchValue);

  if (!normalizedSearch) {
    return true;
  }

  return (
    customer.fullName.toLowerCase().includes(normalizedSearch) ||
    customer.phoneNumber.toLowerCase().includes(normalizedSearch) ||
    customer.vehicleDescription.toLowerCase().includes(normalizedSearch) ||
    customer.registration.toLowerCase().includes(normalizedSearch) ||
    normalizeRegistrationSearch(customer.registration).includes(registrationSearch)
  );
};

export const NewJobDrawer = ({ customers, isOpen, mechanics, onClose, onSubmit }: NewJobDrawerProps) => {
  const [formValues, setFormValues] = useState<NewJobFormValues>(initialFormValues);
  const [formError, setFormError] = useState('');
  const [isNewCustomerMode, setIsNewCustomerMode] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const matchingCustomers = useMemo(() => {
    const sourceCustomers = searchValue.trim()
      ? customers.filter((customer) => customerMatchesSearch(customer, searchValue))
      : customers;

    return sourceCustomers.slice(0, searchValue.trim() ? 6 : 4);
  }, [customers, searchValue]);

  const hasCustomer = Boolean(selectedCustomer) || isNewCustomerMode;
  const hasMissingCustomerField =
    isNewCustomerMode &&
    (!formValues.customerName.trim() || !formValues.phoneNumber.trim() || !formValues.registration.trim());
  const hasMissingJobField =
    !formValues.reason.trim() ||
    !formValues.mechanicId.trim() ||
    !formValues.scheduledStart.trim() ||
    !formValues.scheduledEnd.trim();
  const hasMissingCallbackTime = formValues.callbackRequired && !formValues.callbackDueTime.trim();
  const isAddJobDisabled = !hasCustomer || hasMissingCustomerField || hasMissingJobField || hasMissingCallbackTime;
  const lookupLabel = searchValue.trim() ? 'Search results' : 'Recent customers';

  if (!isOpen) {
    return null;
  }

  const updateFormValue = <FieldName extends keyof NewJobFormValues>(
    fieldName: FieldName,
    fieldValue: NewJobFormValues[FieldName],
  ) => {
    setFormValues((currentFormValues) => ({ ...currentFormValues, [fieldName]: fieldValue }));
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsNewCustomerMode(false);
    setSearchValue('');
    setFormValues((currentFormValues) => ({
      ...currentFormValues,
      customerId: customer.id,
      customerName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      registration: customer.registration,
      vehicleDescription: customer.vehicleDescription,
    }));
  };

  const switchToNewCustomerMode = () => {
    setSelectedCustomer(undefined);
    setIsNewCustomerMode(true);
    setSearchValue('');
    setFormValues(initialFormValues);
  };

  const switchToExistingCustomerMode = () => {
    setSelectedCustomer(undefined);
    setIsNewCustomerMode(false);
    setSearchValue('');
    setFormValues(initialFormValues);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!matchingCustomers.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResultIndex((currentIndex) => Math.min(currentIndex + 1, matchingCustomers.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResultIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      selectCustomer(matchingCustomers[activeResultIndex]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAddJobDisabled) {
      setFormError('Choose an existing customer or add customer details, then fill in the job details.');
      return;
    }

    onSubmit({
      ...formValues,
      status: 'Booked',
      customerName: formValues.customerName.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      registration: formValues.registration.trim().toUpperCase(),
      vehicleDescription: formValues.vehicleDescription.trim() || 'Vehicle details pending',
      reason: formValues.reason.trim(),
    });
    setFormValues(initialFormValues);
    setSelectedCustomer(undefined);
    setIsNewCustomerMode(false);
    setSearchValue('');
    setFormError('');
  };

  const resultListId = 'new-job-customer-results';

  return (
    <div className="garage-workspace__drawer-backdrop">
      <aside aria-labelledby="new-job-heading" aria-modal="true" className="garage-workspace__drawer" role="dialog">
        <div className="garage-workspace__drawer-header">
          <div>
            <p className="garage-workspace__eyebrow">Prototype entry</p>
            <h2 id="new-job-heading">New job</h2>
          </div>
          <Tooltip text="Close new job form">
            <button
              aria-label="Close new job form"
              className="garage-workspace__icon-button"
              onClick={onClose}
              type="button"
            >
              x
            </button>
          </Tooltip>
        </div>

        <form className="garage-workspace__form" onSubmit={handleSubmit}>
          {formError && <p className="garage-workspace__form-error">{formError}</p>}

          {!selectedCustomer && !isNewCustomerMode && (
            <section className="garage-workspace__lookup-panel" aria-label="Find existing customer or vehicle">
              <label>
                <span>Find customer or vehicle</span>
                <input
                  aria-autocomplete="list"
                  aria-controls={resultListId}
                  aria-expanded={matchingCustomers.length > 0}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    setActiveResultIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Name, phone number or registration"
                  role="combobox"
                  type="search"
                  value={searchValue}
                />
              </label>

              <p className="garage-workspace__lookup-label">{lookupLabel}</p>

              <div className="garage-workspace__result-list" id={resultListId} role="listbox">
                {matchingCustomers.length > 0 ? (
                  matchingCustomers.map((customer, index) => (
                    <button
                      aria-selected={activeResultIndex === index}
                      className="garage-workspace__result-option"
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      role="option"
                      type="button"
                    >
                      <strong>{customer.fullName}</strong>
                      <span>
                        {customer.phoneNumber} · {customer.registration} · {customer.vehicleDescription}
                      </span>
                      <span>Last visit: {customer.lastVisit}</span>
                    </button>
                  ))
                ) : (
                  <p className="garage-workspace__empty-state">No matching customer. Add new customer instead.</p>
                )}
              </div>

              <button className="garage-workspace__link-action" onClick={switchToNewCustomerMode} type="button">
                Add new customer instead
              </button>
            </section>
          )}

          {selectedCustomer && (
            <section className="garage-workspace__selected-customer" aria-label="Selected customer">
              <div>
                <strong>{selectedCustomer.fullName}</strong>
                <span>
                  {selectedCustomer.phoneNumber} · {selectedCustomer.registration} ·{' '}
                  {selectedCustomer.vehicleDescription}
                </span>
              </div>
              <button className="garage-workspace__link-action" onClick={switchToExistingCustomerMode} type="button">
                Change
              </button>
            </section>
          )}

          {isNewCustomerMode && (
            <section className="garage-workspace__lookup-panel" aria-label="New customer details">
              <button className="garage-workspace__link-action" onClick={switchToExistingCustomerMode} type="button">
                Find existing customer instead
              </button>
              <label>
                <span>Customer name</span>
                <input
                  onChange={(event) => updateFormValue('customerName', event.target.value)}
                  required
                  type="text"
                  value={formValues.customerName}
                />
              </label>
              <label>
                <span>Phone number</span>
                <input
                  onChange={(event) => updateFormValue('phoneNumber', event.target.value)}
                  required
                  type="tel"
                  value={formValues.phoneNumber}
                />
              </label>
              <label>
                <span>Vehicle registration</span>
                <input
                  onChange={(event) => updateFormValue('registration', event.target.value)}
                  required
                  type="text"
                  value={formValues.registration}
                />
              </label>
              <label>
                <span>Make/model</span>
                <input
                  onChange={(event) => updateFormValue('vehicleDescription', event.target.value)}
                  type="text"
                  value={formValues.vehicleDescription}
                />
              </label>
            </section>
          )}

          {(selectedCustomer || isNewCustomerMode) && (
            <>
              <label>
                <span>Reason for visit</span>
                <input
                  onChange={(event) => updateFormValue('reason', event.target.value)}
                  required
                  type="text"
                  value={formValues.reason}
                />
              </label>

              <label>
                <span>Mechanic</span>
                <select
                  onChange={(event) => updateFormValue('mechanicId', event.target.value)}
                  value={formValues.mechanicId}
                >
                  {mechanics.map((mechanic) => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="garage-workspace__form-grid">
                <label>
                  <span>Scheduled start</span>
                  <input
                    onChange={(event) => updateFormValue('scheduledStart', event.target.value)}
                    required
                    type="time"
                    value={formValues.scheduledStart}
                  />
                </label>

                <label>
                  <span>Scheduled end</span>
                  <input
                    onChange={(event) => updateFormValue('scheduledEnd', event.target.value)}
                    required
                    type="time"
                    value={formValues.scheduledEnd}
                  />
                </label>
              </div>

              <label className="garage-workspace__checkbox">
                <input
                  checked={formValues.callbackRequired}
                  onChange={(event) => updateFormValue('callbackRequired', event.target.checked)}
                  type="checkbox"
                />
                <span>Callback required</span>
              </label>

              {formValues.callbackRequired && (
                <label>
                  <span>Callback due time</span>
                  <input
                    onChange={(event) => updateFormValue('callbackDueTime', event.target.value)}
                    required
                    type="time"
                    value={formValues.callbackDueTime}
                  />
                </label>
              )}
            </>
          )}

          <div className="garage-workspace__drawer-actions">
            <button className="garage-workspace__secondary-action" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="garage-workspace__primary-action" disabled={isAddJobDisabled} type="submit">
              Add job
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};
