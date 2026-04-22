import AccessControl from "accesscontrol";

const ac = new AccessControl();

// ── Admin: full access to everything ──
ac.grant("admin")
  .createAny("Product")
  .readAny("Product")
  .updateAny("Product")
  .deleteAny("Product")

  .createAny("Order")
  .readAny("Order")
  .updateAny("Order")
  .deleteAny("Order")

  .createAny("User")
  .readAny("User")
  .updateAny("User")
  .deleteAny("User");

// ── User: limited access ──
ac.grant("user")
  .readAny("Product") // browse products

  .createOwn("Order") // place orders
  .readOwn("Order") // view own orders
  .updateOwn("Order") // update own orders

  .readOwn("User") // view own profile
  .updateOwn("User"); // edit own profile
export default ac;
