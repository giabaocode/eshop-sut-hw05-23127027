# macOS Hardware Specification Evidence

Collected: 2026-09-01 22:57 +0700 (Asia/Ho_Chi_Minh)

| Field | Real text value |
|---|---|
| Hostname (`hostname`) | `Phams-MacBook-Pro.local` |
| Computer Name | `Phạm’s MacBook Pro` |
| LocalHostName | `Phams-MacBook-Pro` |
| Model Name | `MacBook Pro` |
| Model Identifier | `Mac17,2` |
| Model Number | `MDE54SA/A` |
| Chip | `Apple M5` |
| CPU cores | `10 (4 Performance and 6 Efficiency)` |
| Memory | `16 GB` |
| Architecture | `arm64` |
| macOS | `26.5.2` |
| Build | `25F84` |
| Kernel | `Darwin 25.5.0` |

Sources: real local output from `hostname`, `scutil`, `sw_vers`, `uname`, and
`system_profiler SPHardwareDataType`. Unique hardware identifiers such as the
serial number, hardware UUID, and provisioning UDID were intentionally omitted
from this trackable text file. This table does not replace the PDF-required
human screenshot. On 2026-09-02 the student confirmed this is the same
MacBook/hostname used for the previous homework deployment. A first genuine
screenshot candidate confirmed these values but exposed a serial number and is
therefore withheld. The human replaced it with
`hardware-specs-hostname.jpg`; visual inspection confirmed the hostname,
MacBook Pro 14-inch, Apple M5, and 16 GB with no serial/UUID visible. Its
SHA-256 is
`957b15382a36fe3a1627996d2bdc374ac9a7bfd0c2a1ea9d4f940ea4dc6f6877`.
