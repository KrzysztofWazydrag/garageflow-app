import { Customer, WorkshopTimelineJob } from '../WorkshopTimeline.types';

type CustomerDirectoryProps = {
  customers: Customer[];
  getCustomerCallbackLabel: (customer: Customer) => string;
  latestJobsByRegistration: Map<string, WorkshopTimelineJob>;
  onSearchChange: (searchValue: string) => void;
  searchValue: string;
};

const customerMatchesSearch = (customer: Customer, searchValue: string) => {
  const normalizedSearch = searchValue.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [customer.fullName, customer.phoneNumber, customer.registration].some((value) =>
    value.toLowerCase().includes(normalizedSearch),
  );
};

export const CustomerDirectory = ({
  customers,
  getCustomerCallbackLabel,
  latestJobsByRegistration,
  onSearchChange,
  searchValue,
}: CustomerDirectoryProps) => {
  const filteredCustomers = customers.filter((customer) => customerMatchesSearch(customer, searchValue));

  return (
    <section className="garage-workspace__directory-panel" aria-labelledby="customers-heading">
      <div className="garage-workspace__section-heading">
        <p className="garage-workspace__eyebrow">Lookup</p>
        <h1 id="customers-heading">Customers</h1>
        <p>Find a customer by name, phone number or vehicle registration.</p>
      </div>

      <label className="garage-workspace__directory-search">
        <span>Search customers</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Name, phone or registration"
          type="search"
          value={searchValue}
        />
      </label>

      {filteredCustomers.length > 0 ? (
        <div className="garage-workspace__table" role="table" aria-label="Customer directory">
          <div className="garage-workspace__table-row garage-workspace__table-row--head" role="row">
            <span role="columnheader">Customer</span>
            <span role="columnheader">Phone</span>
            <span role="columnheader">Vehicle</span>
            <span role="columnheader">Last visit</span>
            <span role="columnheader">Callback</span>
          </div>

          {filteredCustomers.map((customer) => {
            const latestJob = latestJobsByRegistration.get(customer.registration);

            return (
              <div className="garage-workspace__table-row" role="row" key={customer.id}>
                <span role="cell">{customer.fullName}</span>
                <span role="cell">{customer.phoneNumber}</span>
                <span role="cell">
                  {customer.registration} · {customer.vehicleDescription}
                </span>
                <span role="cell">{latestJob?.title ?? customer.lastVisit}</span>
                <span role="cell">{getCustomerCallbackLabel(customer)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="garage-workspace__empty-state">No customers match that search.</p>
      )}
    </section>
  );
};
