import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Address } from '../../../core/models/address.model';
import { Order } from '../../../core/models/order.model';
import { UserService } from '../../../core/services/user';
import { AddressService } from '../../../core/services/address';
import { OrderService } from '../../../core/services/order';
import { ToastService } from '../../../core/services/toast';
import { AddressForm } from '../../../shared/components/address-form/address-form';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';

/** User dashboard: profile, address CRUD, and order history. */
@Component({
  selector: 'app-user-profile',
  imports: [CurrencyPipe, DatePipe, AddressForm, LoadSpinner],
  templateUrl: './user-profile.html',
})
export class UserProfile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly addressService = inject(AddressService);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);

  // Route input (component input binding).
  readonly userId = input.required<string>();

  protected readonly user = signal<User | null>(null);
  protected readonly addresses = signal<Address[]>([]);
  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);

  // Address editing state: editingId tracks which row is open; editingAddressModel
  // is the non-null working copy bound into the AddressForm.
  protected readonly editingId = signal<number | null>(null);
  protected readonly editingAddressModel = signal<Address>(this.blankAddress());
  protected readonly showAddForm = signal(false);
  protected readonly newAddress = signal<Address>(this.blankAddress());

  ngOnInit(): void {
    const id = Number(this.userId());

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.addresses.set(user.addressList ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.addressService.getForUser(id).subscribe({
      next: (addresses) => this.addresses.set(addresses),
      error: () => {},
    });

    this.orderService.getUserOrders(id).subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => {},
    });
  }

  // --- Add address ---
  startAdd(): void {
    this.newAddress.set(this.blankAddress());
    this.showAddForm.set(true);
  }

  cancelAdd(): void {
    this.showAddForm.set(false);
  }

  saveNewAddress(): void {
    const id = Number(this.userId());
    this.addressService.add(id, [this.newAddress()]).subscribe({
      next: () => {
        this.toast.success('Address added.');
        this.showAddForm.set(false);
        this.refreshAddresses(id);
      },
      error: () => this.toast.error('Failed to add address.'),
    });
  }

  // --- Edit address ---
  startEdit(address: Address): void {
    this.editingId.set(address.id ?? null);
    this.editingAddressModel.set({ ...address });
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  saveEdit(): void {
    const address = this.editingAddressModel();
    if (!address?.id) {
      return;
    }
    this.addressService.update(address.id, address).subscribe({
      next: () => {
        this.toast.success('Address updated.');
        this.editingId.set(null);
        this.refreshAddresses(Number(this.userId()));
      },
      error: () => this.toast.error('Failed to update address.'),
    });
  }

  // --- Delete address ---
  deleteAddress(address: Address): void {
    if (!address.id || !confirm('Delete this address?')) {
      return;
    }
    this.addressService.delete(address.id).subscribe({
      next: () => {
        this.toast.success('Address deleted.');
        this.refreshAddresses(Number(this.userId()));
      },
      error: () => this.toast.error('Failed to delete address.'),
    });
  }

  private refreshAddresses(userId: number): void {
    this.addressService.getForUser(userId).subscribe({
      next: (addresses) => this.addresses.set(addresses),
      error: () => {},
    });
  }

  private blankAddress(): Address {
    return {
      street: '',
      city: '',
      state: '',
      country: '',
      phoneNumber: '',
      addressType: 'HOME',
    };
  }
}
